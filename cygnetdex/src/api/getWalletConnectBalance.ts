import { useBalance } from 'wagmi';

type EthereumAddress = `0x${string}`;

const useGetWalletConnectBalance = async (address: EthereumAddress) => {
    const balance = useBalance({
        address: address,
      });

      console.log('getWalletConnectBalance balance', balance);
      return balance;
}

export default useGetWalletConnectBalance;