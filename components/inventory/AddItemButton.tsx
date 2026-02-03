import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AddItemButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        <Ionicons name="add" size={24} color="#89A54D" />
        <Text style={styles.text}>Add Item</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        width: '100%', // Chiếm gần nửa màn hình để khớp với Grid
        paddingVertical: 20,      // Độ cao vừa phải
        borderWidth: 2,         // Làm viền đậm hơn
        borderColor: '#638618ff',
        borderStyle: 'dashed',
        flexDirection: 'row',
        borderRadius: 24, // Bo góc lớn giống ảnh
        backgroundColor: '#FBFCF8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    text: {
        color: '#89A54D',
        fontWeight: '700',
        fontSize: 16,
        marginTop: 4,
    },
});