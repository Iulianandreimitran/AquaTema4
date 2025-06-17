interface ErrorTextProps {
  message?: string;
}

const ErrorText = ({ message }: ErrorTextProps) => (
  <p className={`text-xs ${message ? "text-red-500" : "text-transparent"}`}>
    {message || "placeholder"}
  </p>
);

export default ErrorText;
