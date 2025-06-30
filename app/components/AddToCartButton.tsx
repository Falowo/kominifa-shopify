import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export const buttonClassName = `w-max p-2 text-center text-white  shadow-3xl 
bg-gradient-to-b from-lime-700 hover:from-lime-600 via-lime-600 hover:via-lime-600 to-lime-800 hover:to-lime-800 
 font-medium active:bg-gradient-to-t 
rounded-lg  text-md z-30`;

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            className={`${buttonClassName} ${disabled ? 'opacity-0 cursor-none' : 'cursor-pointer'}`}
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
