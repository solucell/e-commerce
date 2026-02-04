import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  updateDoc, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Product } from "../types";

export const productsCollection = collection(db, "products");

// Escuta as mudanças no banco em tempo real
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(productsCollection, orderBy("name", "asc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Product[];
    callback(data);
  });
};

// Cria ou Atualiza um produto
export const saveProduct = async (product: any) => {
  // Limpeza e normalização dos dados antes de enviar ao Firebase
  const data: any = {
    name: product.name,
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    category: product.category,
    image: product.image || '',
    description: product.description || '',
    nameLower: product.name.toLowerCase(),
    updatedAt: new Date().toISOString()
  };

  // Se o produto já tem um ID, atualizamos o existente
  if (product.id && product.id.trim() !== "") {
    const productRef = doc(db, "products", product.id);
    await updateDoc(productRef, data);
    return product.id;
  } else {
    // Se não tem ID, criamos um novo documento com ID automático
    const newDocRef = doc(productsCollection);
    const finalData = { ...data, id: newDocRef.id };
    await setDoc(newDocRef, finalData);
    return newDocRef.id;
  }
};

export const removeProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};