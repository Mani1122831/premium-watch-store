import { useEffect } from 'react';
import Profile from '../components/account/Profile';

export default function Account() {
  useEffect(() => {
    document.title = 'My Account | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  return <Profile />;
}
