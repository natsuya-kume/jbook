import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
const App = () => {
  // 要素への参照
  const ref = useRef<any>();
  // inputの用語管理
  const [input, setInput] = useState("");
  // npm mudulesから取得した値を管理
  const [code, setCode] = useState("");

  const startService = async () => {
    // 値を保持
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  // 　初回のみ実行
  useEffect(() => {
    startService();
  }, []);

  // Submitボタンクリック時の関数
  const onClick = async () => {
    // ref.currentがない場合
    if (!ref.current) {
      return;
    }

    // ref.currentのメソッドからbuildを実行
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        gloabal: "window",
      },
    });

    // console.log(result);

    // 取得したコードをセット
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
