import "./text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

const TextEditor: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  //   MDEditor表示の管理
  const [editing, setEditing] = useState(false);

  const [value, setValue] = useState("# Header");

  //   MDEditorの内部or外部がクリックされているか
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // MDEditor内がクリックされているかを判定
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        // console.log("エディタの中がクリックされました");
        return;
      }
      // MDEditor外がクリックされれば、MDEditorを閉じる
      //   console.log("エディタの外がクリックされました");
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  //   editingがtrueの場合
  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor value={value} onChange={(v) => setValue(v || "")} />
      </div>
    );
  }
  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
