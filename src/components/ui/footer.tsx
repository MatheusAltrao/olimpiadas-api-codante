import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-8 text-center text-xs lg:text-sm">
      Feito com carinho por{" "}
      <Link
        target="_blank"
        className="text-primary underline underline-offset-8"
        href={"https://github.com/MatheusAltrao"}
      >
        Matheus Altrão
      </Link>
    </footer>
  );
};

export default Footer;
