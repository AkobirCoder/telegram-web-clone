// import { IUser } from '@/types';
// import { useState } from 'react';

// const useCurrentContact = () => {
//     const [currentContact, setCurrentContact] = useState<IUser | null>(null);

//     return (
//         {
//             currentContact, setCurrentContact,
//         }
//     );
// }

// export default useCurrentContact;

import { IUser } from '@/types';
import { create } from 'zustand';

type Store = {
    currentContact: IUser | null;

    setCurrentContact: (contact: IUser | null) => void;
}

export const useCurrentContact = create<Store>()((set) => ({
    currentContact: null,
    setCurrentContact: contact => set({currentContact: contact}),
}));