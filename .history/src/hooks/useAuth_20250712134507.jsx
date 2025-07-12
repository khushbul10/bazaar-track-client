
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () {
  const authInfo = useContext(AuthContext);
  if (!authInfo) {
};

export default useAuth;