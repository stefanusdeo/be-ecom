const slugify = require("slugify");

// Fungsi untuk membuat slug
function createSlug(text) {
  return slugify(text, {
    lower: true, // Mengubah huruf besar menjadi huruf kecil
    remove: /[*+~.()'"!:@]/g, // Menghapus karakter khusus tertentu
  });
}

module.exports = createSlug;
