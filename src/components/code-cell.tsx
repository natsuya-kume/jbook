import { useState, useEffect } from "react";
import bundle from "../bundler/index";
import Preview from "./preview";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";

const CodeCell = () => {
  // bundle後のコードとエラーを管理する
  const [code, setCode] = useState("");
  const [err, setError] = useState("");

  // エディタ内で入力されたテキストの管理
  const [input, setInput] = useState("");

  // inputの値が変わるごとに実行
  useEffect(() => {
    // 0.75秒後に実行する  ※inputの値が変更されている間は下でキャンセルされる
    const timer = setTimeout(async () => {
      // bundlerディレクトリのindex.ts内bundle関数にinputを渡し、返ってきた値をoutputに代入
      const output = await bundle(input);
      setCode(output.code);
      setError(output.err);
    }, 750);

    // useEffectが呼び出された後に自動的に呼ばれる 前のtimerをキャンセルする
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
