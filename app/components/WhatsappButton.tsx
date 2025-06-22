import {useEffect, useState} from 'react';
import {FaWhatsapp} from 'react-icons/fa6';
import {Link} from 'react-router';
import {useWindowSize} from '@uidotdev/usehooks';

export default function WhatsappButton({
  to,
  productLink,
}: {
  to?: 'ng' | 'fr';
  productLink?: string;
}) {
  const phoneNumber = to === 'ng' ? '2348144337778' : '33660750932'; // Replace with your WhatsApp numbers for each country
  const text = productLink
    ? `Hi, I want to know more about the product: ${productLink}`
    : 'Hi, I want to know more about your products';
  const [whatsappHref, setWhatsappHref] = useState(
    `https://wa.me/${phoneNumber}?text=${text}`, // Default link for mobile,
  );

  const size = useWindowSize();

  useEffect(() => {
    if (!!size.width && size.width <= 1024) {
      setWhatsappHref(`https://wa.me/${phoneNumber}?text=${text}`);
    } else {
      setWhatsappHref(
        `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, // Link for desktop,
      );
    }
  }, [phoneNumber, size]);

  return (
    <Link
      aria-label="WhatsApp"
      title="WhatsApp"
      to={whatsappHref}
      target="_blank" // Open in new tab
      className="flex flex-row-reverse justify-end-safe"
    >
      {to === 'ng' ? (
        <span className=" text-lime-950 px-2 rounded-md pt-auto">
          Available Worldwide for sales and wholesales | Inquire with Ifadara
          (Nigeria)
        </span>
      ) : (
        <span className=" text-lime-950 px-2 rounded-md pt-auto">
          Inquire about it to Ifalowo (France)
        </span>
      )}
      <FaWhatsapp className={`text-2xl lg:text-3xl rounded-md text-lime-700`} />
    </Link>
  );
}
