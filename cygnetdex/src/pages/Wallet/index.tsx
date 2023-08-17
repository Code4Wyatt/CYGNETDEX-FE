import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialState } from "../../redux/store";
import { addAccountDetailsAction } from "../../redux/actions/AccountAction";

interface InitialState {
    currentUser: {
        user: [
            {
                account: string,
                blocked: boolean,
                domain: string | null,
                email: string,
                force_dtag: boolean
                kycApproved: boolean,
                name: string | null,
                networkEndpoint: string,
                networkType: string,
                picture: string,
                proSubscription: boolean,
                source: string,
                sub: string
            }
        ],
    },
    accountDetails: []
}

interface BalanceInfo {
    currency: string;
    value: string;
}

interface AccountInfo {
    account: string;
    balances: BalanceInfo[];
    sequence: number;
}



function BalanceChecker() {
    const dispatch = useDispatch();

    const accountAddress = useSelector(
        (initialState: InitialState) => initialState?.currentUser?.user[0]?.sub
    );
    const balance = useSelector((initialState: InitialState) => initialState?.accountDetails);

    useEffect(() => {
        if (accountAddress) {
            getAccountInfo(accountAddress)
                .then((data) => {
                    dispatch(addAccountDetailsAction(data));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [accountAddress, dispatch]);

    const XRP_BALANCE_ENDPOINT =
        `https://s.altnet.rippletest.net:51234/accounts/${accountAddress}/balances`;

    async function getAccountInfo(accountAddress: string): Promise<AccountInfo> {
        const endpoint = XRP_BALANCE_ENDPOINT.replace(
            "{account_address}",
            accountAddress
        );

        const response = await fetch(endpoint, {
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        const data = await response.json();

        if (data.result !== "success") {
            throw new Error(`XRP balance check failed: ${data.error_message}`);
        }

        return data.account_data as AccountInfo;
    }
    return (
        <div>
            <h2>Account Balance</h2>
            {accountAddress ? (
                <div>
                    <p>Account Address: {accountAddress}</p>
                    {/* {balance && balance.balances ? (
                        <ul>
                            {balance.balances.map((balance) => (
                                <li key={balance.currency}>
                                    {balance.currency}: {balance.value}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading...</p>
                    )} */}
                </div>
            ) : (
                <p>Please select an account address.</p>
            )}
        </div>
    );
}

export default BalanceChecker;
