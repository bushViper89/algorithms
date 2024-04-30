import { HTMLAttributes } from "react";

const ListItem = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`transition-all duration-700 absolute grid place-content-center aspect-[1/1] border shadow-md rounded ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ListItem;
