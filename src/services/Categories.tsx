

export async function fetchCategories() {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const res = await fetch(`${API_URL}/categories?_embed`);
    if (!res.ok) {
        throw new Error("Gick inte att ladda kategorier");
    }
return await res.json();

}
