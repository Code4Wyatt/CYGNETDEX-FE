import * as React from 'react';
import Navbar from '../../components/Navbar/index';
import './styles.scss';

export interface IHomeProps {
}

export default function Home (props: IHomeProps) {
  return (
    <>
    <Navbar />
    </>
  );
}
