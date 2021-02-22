import { useState, useEffect } from "react";
import bundle from "../bundler/index";
import Preview from "./preview";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // bundle後のコードとエラーを管理する
  const [code, setCode] = useState("");
  const [err, setError] = useState("");

  // エディタ内で入力されるテキストの管理
  const { updateCell } = useActions();

  // inputの値が変わるごとに実行
  useEffect(() => {
    // 0.75秒後に実行する  ※inputの値が変更されている間は下でキャンセルされる
    const timer = setTimeout(async () => {
      // bundlerディレクトリのindex.ts内bundle関数にinputを渡し、返ってきた値をoutputに代入
      const output = await bundle(cell.content);
      setCode(output.code);
      setError(output.err);
    }, 750);

    // useEffectが呼び出された後に自動的に呼ばれる 前のtimerをキャンセルする
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px )",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
