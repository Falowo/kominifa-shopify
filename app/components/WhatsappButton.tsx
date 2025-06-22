import {useCallback, useEffect, useState} from 'react';
import {FaWhatsapp} from 'react-icons/fa6';
import {Link} from 'react-router';
import {useWindowSize} from '@uidotdev/usehooks';

export default function WhatsappButton({to}: {to?: 'ng' | 'fr'}) {
  const phoneNumber = to === 'ng' ? '2348144337778' : '33660750932'; // Replace with your WhatsApp numbers for each country

  const [whatsappHref, setWhatsappHref] = useState(
    `https://wa.me/${phoneNumber}?text=Aboru%20boye%20from%20Kominifa.com`,
  );

  const size = useWindowSize();

  useEffect(() => {
    if (!!size.width && size.width <= 1024) {
      setWhatsappHref(
        `https://wa.me/${phoneNumber}?text=Aboru%20boye%20from%20Kominifa.com`,
      );
    } else {
      setWhatsappHref(
        `https://web.whatsapp.com/send?phone=${phoneNumber}&text=Aboru%20boye%20from%20Kominifa.com`,
      );
    }
  }, [phoneNumber, size]);

  return (
    <Link aria-label="WhatsApp" title="WhatsApp" to={whatsappHref}>
      {to === 'ng' ? (
        <span>
          Available in Nigeria for details and wholesale ! Inquire with Ifadara (Osun State)
        </span>
      ) : (
        <span>Ask about it to Ifalowo (France)</span>
      )}
      <FaWhatsapp
        className={`text-2xl lg:text-3xl rounded-md text-whatsapp-100`}
      />
    </Link>
  );
}
