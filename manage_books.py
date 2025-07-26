import firebase_admin
from firebase_admin import credentials, db

# Load Firebase credentials (you need to download serviceAccountKey from Firebase)
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://bookshelf-a9a41-default-rtdb.firebaseio.com/"
})

def add_book(title, author, bought="not bought"):
    ref = db.reference("books")
    ref.push({"title": title, "author": author, "bought": bought})
    print(f"Added: {title} by {author} ({bought})")

def list_books():
    ref = db.reference("books")
    books = ref.get()
    for k, v in books.items():
        print(f"{k}: {v['title']} by {v['author']}")

def delete_book(book_id):
    db.reference(f"books/{book_id}").delete()
    print(f"Deleted book {book_id}")
