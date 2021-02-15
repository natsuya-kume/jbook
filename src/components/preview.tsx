import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
}

// iframe内のhtmlドキュメント
const html = `
<html>
  <head>
      <style>html {background-color: white; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.addEventListener('message',(event)=>{
        try{
          eval(event.data)
        }catch(err){
          const root=document.querySelector('#root');
          root.innerHTML='<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
          console.error(err)
        }
      },false);
    </script>
  </body>
</hmtl>
`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  // iframeへの参照
  const iframe = useRef<any>();

  useEffect(() => {
    // iframeの内容をリセットするためのコード
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, "*");
  }, [code]);
  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="preview"
      />
    </div>
  );
};

export default Preview;
