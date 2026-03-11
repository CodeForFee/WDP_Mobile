import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/constants/theme";
import { Card, Button, Input, LoadingSpinner } from "@/components/common";
import { useShipment } from "@/hooks/useShipment";
import { uploadRequest } from "@/apiRequest/upload";
import { handleErrorApi } from "@/lib/errors";
import { ShipmentItem } from "@/type";

export default function ReportIssueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { useShipmentDetail, receiveWithDetailsMutation } = useShipment();
  const { data: shipmentDetail, isLoading } = useShipmentDetail(id ?? "");

  const [items, setItems] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [uploadingIndices, setUploadingIndices] = useState<number[]>([]);

  useEffect(() => {
    if (shipmentDetail?.items) {
      setItems(
        shipmentDetail.items.map((item: ShipmentItem) => ({
          batchId: item.batchId,
          productName: item.productName,
          sku: item.sku,
          batchCode: item.batchCode,
          expectedQty: item.quantity,
          actualQty: item.quantity,
          damagedQty: 0,
          evidenceUrls: [],
        }))
      );
    }
  }, [shipmentDetail]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = parseInt(value) || 0;
    setItems(newItems);
  };

  const handlePickImage = async (index: number) => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Quyền truy cập", "Cần quyền thư viện ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    setUploadingIndices((prev) => [...prev, index]);

    try {
      const uploadPromises = result.assets.map(async (asset) => {
        const formData = new FormData();
        const type = asset.uri.split(".").pop();

        formData.append("file", {
          uri: asset.uri,
          name: `evidence_${Date.now()}.${type}`,
          type: `image/${type}`,
        } as any);

        return uploadRequest.uploadImage(formData);
      });

      const uploaded = await Promise.all(uploadPromises);

      const newItems = [...items];
      newItems[index].evidenceUrls.push(...uploaded.map((i) => i.url));

      setItems(newItems);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setUploadingIndices((prev) => prev.filter((i) => i !== index));
    }
  };

  const removeImage = (itemIndex: number, imgIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].evidenceUrls.splice(imgIndex, 1);
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (!id) return;

    const hasError = items.some(
      (i) => i.actualQty + i.damagedQty > i.expectedQty
    );

    if (hasError) {
      Alert.alert(
        "Lỗi",
        "Số lượng thực nhận + hư hỏng không được vượt quá dự kiến."
      );
      return;
    }

    const payload = {
      items: items.map((i) => ({
        batchId: i.batchId,
        actualQty: i.actualQty,
        damagedQty: i.damagedQty,
        evidenceUrls: i.evidenceUrls,
      })),
      notes,
    };

    receiveWithDetailsMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Đã gửi báo cáo.");
          router.replace("/(franchise-staff)/(tabs)/receiving");
        },
        onError: (error) => handleErrorApi({ error }),
      }
    );
  };

  if (isLoading)
    return (
      <View style={styles.loading}>
        <LoadingSpinner size={40} color={COLORS.primary} />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Shipment */}
          <Card style={styles.shipmentCard}>
            <Text style={styles.shipmentLabel}>Mã shipment</Text>
            <Text style={styles.shipmentValue}>{id}</Text>
          </Card>

          <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>

          {items.map((item, index) => (
            <Card key={index} style={styles.itemCard}>
              {/* PRODUCT INFO */}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {item.productName}
                </Text>

                <Text style={styles.meta}>
                  SKU: {item.sku} • Lô: {item.batchCode}
                </Text>

                <Text style={styles.expected}>
                  Dự kiến: {item.expectedQty}
                </Text>
              </View>

              {/* QTY */}
              <View style={styles.qtyRow}>
                <Input
                  label="Thực nhận"
                  keyboardType="numeric"
                  value={String(item.actualQty)}
                  onChangeText={(v) =>
                    updateItem(index, "actualQty", v)
                  }
                  containerStyle={{ flex: 1 }}
                />

                <Input
                  label="Hư hỏng"
                  keyboardType="numeric"
                  value={String(item.damagedQty)}
                  onChangeText={(v) =>
                    updateItem(index, "damagedQty", v)
                  }
                  containerStyle={{ flex: 1 }}
                />
              </View>

              {/* IMAGES */}
              <View style={styles.images}>
                {item.evidenceUrls.map((url: string, imgIndex: number) => (
                  <View key={imgIndex} style={styles.imageWrapper}>
                    <Image source={{ uri: url }} style={styles.image} />

                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeImage(index, imgIndex)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={COLORS.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addImage}
                  onPress={() => handlePickImage(index)}
                >
                  <Ionicons
                    name="camera-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </Card>
          ))}

          <Text style={styles.sectionTitle}>Ghi chú</Text>

          <Input
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Mô tả vấn đề..."
            inputStyle={styles.notes}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Gửi báo cáo vấn đề"
            onPress={handleSubmit}
            loading={receiveWithDetailsMutation.isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  content: { padding: SPACING.base, paddingBottom: 120 },

  shipmentCard: {
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  shipmentLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  shipmentValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },

  itemCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  productInfo: {
    marginBottom: SPACING.sm,
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
  },

  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  expected: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "600",
  },

  qtyRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  images: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: SPACING.sm,
  },

  imageWrapper: {
    width: 70,
    height: 70,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.sm,
  },

  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
  },

  addImage: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  notes: {
    height: 100,
    textAlignVertical: "top",
    color: COLORS.textPrimary,
  },

  footer: {
    padding: SPACING.base,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: "#fff",
  },
});
