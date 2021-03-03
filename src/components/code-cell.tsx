// コードセル全体を管理するコンポーネント
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
  // useAction()を使用して、updateCell(id,content), createBundle(cellId,input)のactionを取得 ()の中は引数
  const { updateCell, createBundle } = useActions();

  // 別ファイルで定義したuseTypedSelectorでbundleの状態を取得
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // 全てのコードを取得する エディタ内で前のエディタコードを参照できるようにするために、
  // 全てのセルの情報を含む配列を作る
  const cumulativeCode = useTypedSelector((state) => {
    // dataとorderを取得
    const { data, order } = state.cells;
    // orderをマップして、dataオブジェクトと比較して新しい配列を作成
    const orderedCells = order.map((id) => data[id]);

    // 空の配列を定義
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        cumulativeCode.push(c.content);
      }
      // c.id === cell.idが見つかれば反復を停止
      if (c.id === cell.id) {
        break;
      }
    }
    return cumulativeCode;
  });

  // cellの情報が変わるごとに実行
  useEffect(() => {
    // bundleがない場合に走る
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join("\n"));
      return;
    }
    // 0.75秒後に実行する  ※inputの値が変更されている間は下でキャンセルされる
    const timer = setTimeout(async () => {
      // actionの呼び出し セルのidとエディタ内に入力されたテキストを渡す
      createBundle(cell.id, cumulativeCode.join("\n"));
    }, 750);

    // useEffectが呼び出された後に自動的に呼ばれる 前のtimerをキャンセルする
    return () => {
      clearTimeout(timer);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode.join("\n"), cell.id, createBundle]);

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
