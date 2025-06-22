import {useState} from 'react';

export default function Background() {
  // const [bgUrlClass, setBgUrlClass] = useState<string>(`bg-[url('/images/cowrie-bg.webp')]`);
  const bgUrlClass = `bg-[url('https://cdn.shopify.com/s/files/1/0906/1384/2263/files/cowrie-bg.webp?v=1750542844')] bg-cover bg-no-repeat`;
  const [neutralBgClassNames, setNeutralBgClassNames] = useState<string>(
    'bg-neutral-950 bg-opacity-35',
  );
  return (
    <div className={`w-full flex flex-col`}>
      <div
        className={`fixed z-0 w-full  ${bgUrlClass} bg-cover 
				bg-fixed`}
      >
        <div className={`${neutralBgClassNames} h-screen w-screen z-0`}></div>
      </div>
    </div>
  );
}
