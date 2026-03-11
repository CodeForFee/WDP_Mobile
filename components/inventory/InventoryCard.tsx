import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const InventoryCard = ({ item }: { item: any }) => {
    // Format ngày hết hạn
    const formatExpiryDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <View style={styles.card}>
            <View style={styles.imageWrapper}>
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={32} color="#CCC" />
                    </View>
                )}
                <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>{item.stock} {item.unit || ''}</Text>
                </View>
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={12} color="#E67E22" />
                    <Text style={styles.expiryText}>HSD: {formatExpiryDate(item.expiryDate)}</Text>
                </View>
                <Text style={styles.desc}>SKU: {item.description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    imageWrapper: { height: 120, position: 'relative', backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
    placeholderImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    image: { width: '100%', height: '100%' },
    stockBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#27AE60', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    stockText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
    info: { padding: 12, flex: 1 },
    name: { fontSize: 14, fontWeight: '700', color: '#333', lineHeight: 18 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
    expiryText: { fontSize: 10, color: '#E67E22', fontWeight: '600' },
    desc: { fontSize: 10, color: '#999', marginTop: 4 }
});