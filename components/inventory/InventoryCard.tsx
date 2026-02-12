import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const InventoryCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <TouchableOpacity style={styles.heartBtn}>
                    <Ionicons name="heart" size={16} color="#E74C3C" />
                </TouchableOpacity>
                <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>{item.stock}/{item.maxStock}</Text>
                </View>
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.calRow}>
                    <Ionicons name="flame" size={14} color="#E74C3C" />
                    <Text style={styles.calText}>{item.calories}</Text>
                </View>
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.footer}>
                    <Text style={styles.price}>${item.price}</Text>
                    <View style={styles.iconGroup}>
                        <Ionicons name="flame" size={14} color="#E74C3C" />
                        <Ionicons name="flame" size={14} color="#DDD" />
                        <Ionicons name="flame" size={14} color="#DDD" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { width: '48%', backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, overflow: 'hidden' },
    imageWrapper: { height: 140, position: 'relative' },
    image: { width: '100%', height: '100%' },
    heartBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FFF', padding: 6, borderRadius: 20 },
    stockBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    stockText: { fontSize: 10, fontWeight: '700' },
    info: { padding: 12 },
    name: { fontSize: 16, fontWeight: '700' },
    calRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 4 },
    calText: { color: '#999', fontSize: 12 },
    desc: { fontSize: 11, color: '#AAA', lineHeight: 16 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    price: { fontSize: 18, fontWeight: '800' },
    iconGroup: { flexDirection: 'row', gap: 2 }
});