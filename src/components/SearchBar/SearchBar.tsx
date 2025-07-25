import styles from "./SearchBar.module.css";
import { toast } from "react-hot-toast";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    const value = formData.get("query")?.toString().trim() || "";

    if (!value) {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(value);
  };

  return (
    <header className={styles.header}>
      {" "}
      <div className={styles.container}>
        {" "}
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB{" "}
        </a>{" "}
        <form action={handleSubmit} className={styles.form}>
          {" "}
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />{" "}
          <button className={styles.button} type="submit">
            Search{" "}
          </button>{" "}
        </form>{" "}
      </div>
    </header>
  );
}
