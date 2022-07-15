const Footnote = ({ children }: React.PropsWithChildren) => {
  return (
    <p style={{ whiteSpace: "pre-wrap" }} className="text-turquoise px-12 py-8 text-4xl">
      {children}
    </p>
  );
};

export default Footnote;
