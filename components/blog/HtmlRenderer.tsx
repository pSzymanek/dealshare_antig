type HtmlRendererProps = {
  content: string;
};

export function HtmlRenderer({ content }: HtmlRendererProps) {
  return <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />;
}
