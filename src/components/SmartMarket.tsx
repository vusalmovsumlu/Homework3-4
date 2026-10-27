
import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  SectionList, Alert, StyleSheet, useWindowDimensions
} from "react-native";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

const categories = ["Meyvələr", "Ət məhsulları", "Şirniyyatlar", "İçkilər"];

export default function SmartMarket() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;

  const [category, setCategory] = useState("Meyvələr");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  function addProduct() {
    const number = Number(price);

    if (!name.trim() || !price.trim() || number <= 0 || !Number.isFinite(number)) {
      Alert.alert("Xəta", "Ad və qiymət daxil edin!");
      return;
    }

    setProducts([
      ...products,
      { id: Date.now(), name: name.trim(), price: number, category }
    ]);

    setName("");
    setPrice("");
  }

  function deleteProduct(id: number) {
    setProducts(products.filter(p => p.id !== id));
  }

  function addToCart(product: Product) {
    setCart([...cart, product]);
    Alert.alert("Səbət", "Məhsul əlavə edildi!");
  }

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const sections = categories
    .filter(c => c === category)
    .map(c => ({
      title: c,
      data: [products.filter(p => p.category === c)]
    }));

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(_, index) => index.toString()}

        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Smart Market</Text>

            <Text style={styles.title}>
              Səbətdə: {cart.length} məhsul / {total} AZN
            </Text>

            <View style={styles.row}>
              {categories.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.button,
                    category === c && { backgroundColor: "lightgreen" }
                  ]}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Məhsul adı"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Qiymət"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              onSubmitEditing={addProduct}
            />

            <TouchableOpacity style={styles.button} onPress={addProduct}>
              <Text>Əlavə et</Text>
            </TouchableOpacity>
          </View>
        }

        renderSectionHeader={({ section }) => (
          <Text style={styles.title}>{section.title}</Text>
        )}

        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map(product => (
              <View
                key={product.id}
                style={[
                  styles.card,
                  { width: landscape ? "31%" : "48%" }
                ]}
              >
                <Text>{product.name}</Text>
                <Text>{product.price} AZN</Text>

                <TouchableOpacity onPress={() => addToCart(product)}>
                  <Text style={styles.link}>+ Səbətə əlavə et</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteProduct(product.id)}>
                  <Text style={{ color: "red" }}>Sil</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  link: {
    color: "green",
  },
});
