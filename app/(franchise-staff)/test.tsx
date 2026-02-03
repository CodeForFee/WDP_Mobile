import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert, Modal, RefreshControl, TextInput } from 'react-native';
import { LoadingSpinner } from '@/components/common';
import { useStoreOrder } from '@/stores/storeOrder';
import { useOrder } from '@/hooks/useOrder';
import { Catelog, OrderMyStore, OrderDetail } from '@/type';
import { OrderStatus } from '@/enum';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleErrorApi } from '@/lib/errors';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const orderSchema = z.object({
    deliveryDate: z.date().refine((date) => date > new Date(), {
        message: "Delivery date must be in the future",
    }),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function OrderTestPage() {
    const router = useRouter();
    const { items, addItem, updateQuantity, removeItem, clearItems } = useStoreOrder();

    // Local State
    const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
    const [catalog, setCatalog] = useState<Catelog[]>([]);
    const [orders, setOrders] = useState<OrderMyStore[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    const { control, handleSubmit, setError, formState: { errors }, setValue, watch } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            deliveryDate: new Date(new Date().setHours(new Date().getHours() + 24)), // Default tomorrow same time to ensure > now
        }
    });

    // Initial Load
    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        setLoading(true);
        try {
            const data = await useOrder.getCatalog();
            setCatalog(data);
        } catch (error) {
            handleErrorApi({ error });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await useOrder.getMyStoreOrders();
            setOrders(data);
        } catch (error) {
            handleErrorApi({ error });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCreateOrder = async (data: OrderFormData) => {
        if (items.length === 0) return Alert.alert("Empty Cart", "Please add items first");

        setLoading(true);
        try {
            // Ensure we send a valid ISO string
            const isoDate = data.deliveryDate.toISOString();

            await useOrder.createOrder({
                deliveryDate: isoDate,
                items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
            });

            Alert.alert("Success", "Order created successfully!");
            clearItems();
            setActiveTab('orders');
            fetchOrders();
        } catch (error) {
            handleErrorApi({ error, setError });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        Alert.alert("Confirm", "Are you sure you want to cancel this order?", [
            { text: "No", style: 'cancel' },
            {
                text: "Yes", style: 'destructive', onPress: async () => {
                    setLoading(true);
                    try {
                        await useOrder.cancelOrder(orderId);
                        Alert.alert("Success", "Order cancelled");
                        fetchOrders();
                        if (selectedOrder?.id === orderId) setModalVisible(false);
                    } catch (error) {
                        handleErrorApi({ error });
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    const handleViewOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const data = await useOrder.getOrderById(orderId);
            setSelectedOrder(data);
            setModalVisible(true);
        } catch (error) {
            handleErrorApi({ error });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Catelog) => {
        const existing = items.find(i => i.id === product.id);
        if (existing) {
            updateQuantity(product.id, existing.quantity + 1);
        } else {
            addItem({ id: product.id, quantity: 1 });
        }
    };

    const getCartTotal = () => items.reduce((acc, curr) => acc + curr.quantity, 0);

    // --- Render Components ---

    const renderCatalog = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Catalog</Text>
            {catalog.length === 0 ? (
                <Text style={styles.emptyText}>No products available.</Text>
            ) : (
                catalog.map((prod) => {
                    const inCart = items.find(i => i.id === prod.id);
                    return (
                        <View key={prod.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconBatch}>
                                    <Ionicons name="cube-outline" size={24} color="#6366F1" />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.cardTitle}>{prod.name}</Text>
                                    <Text style={styles.cardSubtitle}>SKU: {prod.sku} • {prod.unit}</Text>
                                </View>
                            </View>
                            <View style={styles.cardAction}>
                                {inCart ? (
                                    <View style={styles.counter}>
                                        <TouchableOpacity onPress={() => inCart.quantity > 1 ? updateQuantity(prod.id, inCart.quantity - 1) : removeItem(prod.id)}>
                                            <Ionicons name="remove-circle" size={28} color="#EF4444" />
                                        </TouchableOpacity>
                                        <Text style={styles.counterText}>{inCart.quantity}</Text>
                                        <TouchableOpacity onPress={() => updateQuantity(prod.id, inCart.quantity + 1)}>
                                            <Ionicons name="add-circle" size={28} color="#10B981" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.addButton} onPress={() => addToCart(prod)}>
                                        <Text style={styles.addButtonText}>Add to Order</Text>
                                        <Ionicons name="cart-outline" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                })
            )}
        </View>
    );

    const renderOrders = () => (
        <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>My Orders</Text>
                <TouchableOpacity onPress={fetchOrders} style={styles.refreshBtn}>
                    <Ionicons name="refresh" size={18} color="#4F46E5" />
                    <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            {orders.length === 0 ? (
                <Text style={styles.emptyText}>No orders found.</Text>
            ) : (
                orders.map((ord) => (
                    <TouchableOpacity key={ord.id} style={styles.orderCard} onPress={() => handleViewOrder(ord.id)}>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderId}>#{ord.id.slice(0, 8)}...</Text>
                            <View style={[styles.badge,
                            ord.status === OrderStatus.PENDING ? styles.bgYellow :
                                ord.status === OrderStatus.DELIVERED ? styles.bgGreen : styles.bgGray
                            ]}>
                                <Text style={[styles.badgeText,
                                ord.status === OrderStatus.PENDING ? styles.textYellow :
                                    ord.status === OrderStatus.DELIVERED ? styles.textGreen : styles.textGray
                                ]}>{ord.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.orderDate}>Deliv: {new Date(ord.deliveryDate).toLocaleDateString()}</Text>
                        <Text style={styles.orderDate}>Placed: {new Date(ord.createdAt).toLocaleDateString()}</Text>

                        <View style={styles.orderFooter}>
                            <Text style={styles.viewDetailsText}>View Details</Text>
                            {ord.status === OrderStatus.PENDING && (
                                <TouchableOpacity onPress={() => handleCancelOrder(ord.id)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </View>
    );

    const renderCartBar = () => {
        if (items.length === 0) return null;
        return (
            <View style={styles.cartBar}>
                <View style={styles.cartBarContent}>
                    <View style={styles.cartBarLeft}>
                        <Text style={styles.cartInfo}>{getCartTotal()} items</Text>
                        <Text style={styles.cartSub}>Ready to order</Text>
                        <View style={styles.dateInputContainer}>
                            <Text style={styles.dateLabel}>Delivery Date:</Text>
                            <Controller
                                control={control}
                                name="deliveryDate"
                                render={({ field: { value, onChange } }) => (
                                    <View>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <TouchableOpacity
                                                style={[styles.dateInput, { flex: 1 }]}
                                                onPress={() => {
                                                    setPickerMode('date');
                                                    setShowPicker(true);
                                                }}
                                            >
                                                <Ionicons name="calendar-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
                                                <Text style={{ color: '#FFF', fontSize: 12 }}>
                                                    {value ? value.toLocaleDateString() : 'Date'}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.dateInput, { flex: 1 }]}
                                                onPress={() => {
                                                    setPickerMode('time');
                                                    setShowPicker(true);
                                                }}
                                            >
                                                <Ionicons name="time-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
                                                <Text style={{ color: '#FFF', fontSize: 12 }}>
                                                    {value ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        {showPicker && (
                                            <DateTimePicker
                                                value={value || new Date()}
                                                mode={pickerMode}
                                                is24Hour={true}
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    setShowPicker(Platform.OS === 'ios');
                                                    if (selectedDate) {
                                                        // Merge changes depending on mode? 
                                                        // Actually, DateTimePicker returns a new Date object with the *changed* component.
                                                        // If mode is 'date', it returns (SelectedDate + OldTime) or (SelectedDate + 00:00) depending on implementation.
                                                        // RNDTP typically preserves the other part if you pass the current `value` as `value`.
                                                        // Since we passed `value={value}`, `selectedDate` should have the updated component and preserved other component.
                                                        onChange(selectedDate);
                                                    }
                                                }}
                                            />
                                        )}
                                        {errors.deliveryDate && <Text style={{ color: '#EF4444', fontSize: 10, marginTop: 4 }}>{errors.deliveryDate.message}</Text>}
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    <View style={styles.cartBarRight}>
                        <TouchableOpacity onPress={clearItems} style={styles.clearBtn}>
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.checkoutBtn} onPress={handleSubmit(handleCreateOrder)}>
                            <Text style={styles.checkoutText}>Submit</Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Order Management</Text>
                <Text style={styles.headerSubtitle}>Franchise Staff Portal</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'catalog' && styles.activeTab]}
                    onPress={() => setActiveTab('catalog')}
                >
                    <Text style={[styles.tabText, activeTab === 'catalog' && styles.activeTabText]}>New Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
                    onPress={() => { setActiveTab('orders'); fetchOrders(); }}
                >
                    <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => activeTab === 'catalog' ? fetchCatalog() : fetchOrders()} />
                }
            >
                {loading && <LoadingSpinner size={32} color="#4F46E5" style={{ marginVertical: 20 }} />}
                {activeTab === 'catalog' ? renderCatalog() : renderOrders()}
                <View style={{ height: 160 }} />
            </ScrollView>

            {/* Floating Cart Bar (only in catalog) */}
            {activeTab === 'catalog' && renderCartBar()}

            {/* Order Detail Modal */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Order Details</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </View>
                    {selectedOrder ? (
                        <ScrollView style={styles.modalContent}>
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Order ID</Text>
                                <Text style={styles.detailValue}>{selectedOrder.id}</Text>
                            </View>
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Status</Text>
                                <Text style={styles.detailValue}>{selectedOrder.status}</Text>
                            </View>
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Delivery Date</Text>
                                <Text style={styles.detailValue}>{new Date(selectedOrder.deliveryDate).toDateString()}</Text>
                            </View>
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Note</Text>
                                <Text style={styles.detailValue}>{selectedOrder.note || 'None'}</Text>
                            </View>

                            <Text style={styles.itemsTitle}>Items</Text>
                            {selectedOrder.items.map((item, idx) => (
                                <View key={idx} style={styles.itemRow}>
                                    <View>
                                        <Text style={styles.itemName}>{item.product.name}</Text>
                                        <Text style={styles.itemSku}>{item.product.sku}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.itemQty}>x{item.quantityRequested}</Text>
                                        <Text style={styles.itemUnit}>{item.product.unit}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <LoadingSpinner size={24} />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 20, backgroundColor: '#FFFFFF' },
    headerTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },
    headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    tabs: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 10 },
    tab: { marginRight: 24, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#4F46E5' },
    tabText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
    activeTabText: { color: '#4F46E5' },
    content: { flex: 1, padding: 16 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 12 },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 32, fontStyle: 'italic' },
    // Cards
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'column', gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    iconBatch: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    cardSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    cardAction: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },

    addButton: { flexDirection: 'row', backgroundColor: '#4F46E5', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', gap: 6 },
    addButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

    counter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    counterText: { fontSize: 18, fontWeight: '600', color: '#1F2937', minWidth: 24, textAlign: 'center' },

    // Toggle Cart
    cartBar: { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: '#1F2937', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 6 },
    cartBarContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cartBarLeft: { flex: 1.5, paddingRight: 10 },
    cartBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },

    cartInfo: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    cartSub: { color: '#9CA3AF', fontSize: 12 },

    dateInputContainer: { marginTop: 8 },
    dateLabel: { color: '#9CA3AF', fontSize: 10, marginBottom: 2 },
    dateInput: { backgroundColor: '#374151', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4, minWidth: 80 },

    checkoutBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', gap: 8 },
    checkoutText: { color: '#FFF', fontWeight: '600' },
    clearBtn: { padding: 8, backgroundColor: '#374151', borderRadius: 8 },

    // Order List
    refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    refreshText: { color: '#4F46E5', fontWeight: '600', fontSize: 14 },
    orderCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#4F46E5', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    orderId: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
    badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    bgYellow: { backgroundColor: '#FEF3C7' }, textYellow: { color: '#D97706' },
    bgGreen: { backgroundColor: '#D1FAE5' }, textGreen: { color: '#059669' },
    bgGray: { backgroundColor: '#F3F4F6' }, textGray: { color: '#6B7280' },
    orderDate: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    viewDetailsText: { color: '#4F46E5', fontWeight: '600' },
    cancelText: { color: '#EF4444', fontWeight: '600' },

    // Modal
    modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: '700' },
    closeBtn: { padding: 4 },
    modalContent: { padding: 20 },
    detailSection: { marginBottom: 16 },
    detailLabel: { fontSize: 12, color: '#6B7280', textTransform: 'uppercase', marginBottom: 4 },
    detailValue: { fontSize: 16, color: '#1F2937', fontWeight: '500' },
    itemsTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 12 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    itemName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    itemSku: { fontSize: 12, color: '#6B7280' },
    itemQty: { fontSize: 16, fontWeight: '700', color: '#4F46E5' },
    itemUnit: { fontSize: 12, color: '#6B7280' }
});
