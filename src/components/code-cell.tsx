import "./code-cell.css";
import { useEffect } from "react";
import Preview from "./preview";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // エディタ内で入力されるテキストの管理
  const { updateCell, createBundle } = useActions();

  // bundleの状態を取得できる
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // inputの値が変わるごとに実行
  useEffect(() => {
    // bundleがない場合
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }
    // 0.75秒後に実行する  ※inputの値が変更されている間は下でキャンセルされる
    const timer = setTimeout(async () => {
      // actionの呼び出し セルのidとエディタ内に入力されたテキストを渡す
      createBundle(cell.id, cell.content);
    }, 750);

    // useEffectが呼び出された後に自動的に呼ばれる 前のtimerをキャンセルする
    return () => {
      clearTimeout(timer);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.content, cell.id, createBundle]);

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
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
