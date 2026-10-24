
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("my-notes")) || [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [now, setNow] = useState(new Date());

  // Update the date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Save notes in the browser
  useEffect(() => {
    localStorage.setItem("my-notes", JSON.stringify(notes));
  }, [notes]);

  function saveNote(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and your note.");
      return;
    }

    if (editId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setNotes((currentNotes) => [newNote, ...currentNotes]);
    }

    clearForm();
  }

  function clearForm() {
    setTitle("");
    setContent("");
    setEditId(null);
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);

    document.getElementById("note-title")?.focus();
  }

  function deleteNote(id) {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );

      if (editId === id) {
        clearForm();
      }
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="topbar">
        <a href="#home" className="logo">
          <span className="logo-icon">N</span>
          NoteNest
        </a>

        <span className="topbar-label">Your thoughts, organized.</span>
      </header>

      <main className="dashboard" id="home">
        <section className="welcome">
          <p className="eyebrow">YOUR PERSONAL NOTEBOOK</p>
          <h1>Your ideas, <span>beautifully saved.</span></h1>
          <p>Write it down today. Find it whenever you need it.</p>
        </section>

        <section className="date-card">
          <div className="date-icon">▦</div>

          <div>
            <p className="date-label">TODAY</p>

            <h2>
              {now.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>

            <p className="live-time">
              ◷ {now.toLocaleTimeString("en-GB")}
            </p>
          </div>
        </section>

        <section className="add-section">
          <h2>{editId !== null ? "Edit your note" : "Write a note"}</h2>

          <form onSubmit={saveNote}>
            <label htmlFor="note-title">Note title</label>

            <input
              id="note-title"
              type="text"
              placeholder="e.g. React Learning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="note-content">Your note</label>

            <textarea
              id="note-content"
              placeholder="Write your thoughts here..."
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <div className="form-buttons">
              <button className="save-button" type="submit">
                {editId !== null ? "Save Changes" : "+ Save Note"}
              </button>

              {editId !== null && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="notes-section">
          <div className="section-heading">
            <div>
              <h2>My Notes</h2>
              <p>
                {notes.length} {notes.length === 1 ? "note" : "notes"} saved
              </p>
            </div>

            <span className="note-count">{notes.length} total</span>
          </div>

          <div className="search-box">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="notes-grid">
            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✎</div>

                <h3>
                  {search ? "No notes found" : "Your notebook is empty"}
                </h3>

                <p>
                  {search
                    ? "Try searching with another word."
                    : "Write your first note above to get started."}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <article className="note-card" key={note.id}>
                  <div className="note-heading">
                    <h3>{note.title}</h3>

                    <div className="note-actions">
                      <button
                        className="icon-button"
                        onClick={() => editNote(note)}
                        title="Edit note"
                        aria-label={`Edit ${note.title}`}
                      >
                        ✎
                      </button>

                      <button
                        className="icon-button delete-button"
                        onClick={() => deleteNote(note.id)}
                        title="Delete note"
                        aria-label={`Delete ${note.title}`}
                      >
                        ♲
                      </button>
                    </div>
                  </div>

                  <p className="note-content">{note.content}</p>

                  <div className="note-footer">
                    <span>◷ {formatDate(note.updatedAt || note.createdAt)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <footer>
          <p>Your thoughts matter. Save them here. ♡</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
