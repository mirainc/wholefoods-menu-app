const Footnote = ({ children }: React.PropsWithChildren) => {
  return (
    // Ensure new line characters are respected by setting white space to "pre-wrap"
    <p style={{ whiteSpace: "pre-wrap" }} className="text-turquoise px-12 py-8 text-4xl">
      {children}
    </p>
  );
};

export default Footnote;
