import {defineStore} from 'pinia';
import {Connection,Transaction} from '@solana/web3.js';
import {useWallet} from "solana-wallets-vue";

export const useSolanaStore = defineStore('solanaStore',() => {

	const wallet = ref('');
	const apiUrl = useRuntimeConfig().public.baseURL;
	console.log('apiUrl:',apiUrl);
	const connectedWallet = computed(() => wallet.wallet.value?.adapter?.name);

	const signEncodedTransaction = async (encodedTransaction) => {
		const {Buffer} = await import('buffer');
		const wallet = useWallet().wallet.value;

		if (!wallet) {
			alert('Wallet not connected');
			return;
		}

		let provider;
		const walletName = wallet.adapter.name.toLowerCase();

		switch (walletName) {
			case 'backpack':
				provider = window.backpack;
				break;
			case 'solana':
			case 'phantom':
				provider = window.solana;
				break;
			case 'solflare':
				provider = window.solflare;
				break;
			default:
				alert('Unsupported wallet');
				return;
		}

		if (!provider) {
			alert('Wallet provider not found');
			return;
		}

		const connection = new Connection('https://api.devnet.solana.com','confirmed');

		let transaction;
		try {
			transaction = Transaction.from(Buffer.from(encodedTransaction,'base64'));
		} catch (error) {
			console.error('Failed to parse transaction:',error);
			return;
		}

		try {
			console.log("Signing transaction",transaction);
			const signedTransaction = await provider.signTransaction(transaction);
			const txid = await connection.sendRawTransaction(signedTransaction.serialize(),{
				skipPreflight:true,
				preflightCommitment:'confirmed',
			});

			await connection.confirmTransaction(txid,'confirmed');
			return `https://solscan.io/tx/${txid}?cluster=devnet`
		} catch (error) {
			console.error('Error signing transaction:',error);
			throw error
		}
	}

	const createToken = async (name,symbol,decimals) => {
		try {
			const params = {payer:wallet.value,name,symbol,decimals};
			const res = await fetch(`${apiUrl}/solana/create-token`,{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify(params),
			});

			if (!res.ok) {
				alert('Failed to create token');
				return;
			}
			const resData = await res.json()
			console.log('resData:',resData);
			const tx = await signEncodedTransaction(resData.data.encodedTransaction);
			return {
				tx,
				mintPublicKey:resData.data.mintPublicKey,
			};
		} catch (e) {
			console.error('Error creating token:',e);
			throw e;
		}
	};

	const mintToken = async (mintAddress,recipientAddress,amount) => {
		try {
			const params = {
				payer:wallet.value,
				mintAddress,
				recipientAddress,
				amount,
			};
			const res = await fetch(`${apiUrl}/solana/mint-token`,{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify(params),
			});

			if (!res.ok) {
				alert('Failed to mint token',await res.text());
				return;
			}

			const resData = await res.json();
			console.log('resData:',resData);
			const tx = await signEncodedTransaction(resData.data.encodedTransaction);
			return {tx};

		} catch (e) {
			console.error('Error minting token:',e);
			throw e;
		}
	};

	const transferToken = async (fromAddress,toAddress,mintAddress,amount) => {
		try {
			const params = {
				payer:wallet.value,
				fromAddress,
				toAddress,
				mintAddress,
				amount,
			};
			const res = await fetch(`${apiUrl}/solana/transfer-token`,{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify(params),
			});

			if (!res.ok) {
				alert('Failed to transfer token',await res.text());
				return;
			}

			const resData = await res.json();

			const tx = await signEncodedTransaction(resData.data.encodedTransaction);

			return {tx};
		} catch (e) {
			console.error('Error transferring token:',e);
			throw e
		}
	};

	const burnToken = async (accountAddress,mintAddress,amount) => {
		try {
			const params = {
				payer:wallet.value,
				accountAddress,
				mintAddress,
				amount,
			};
			const res = await fetch(`${apiUrl}/solana/burn-token`,{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify(params),
			});

			if (!res.ok) {
				alert('Failed to burn token',await res.text());
				return;
			}

			const resData = await res.json();
			const tx = await signEncodedTransaction(resData.data.encodedTransaction);
			return {tx};
		} catch (e) {
			throw e;
		}

	};

	const delegateToken = async (ownerAddress,delegateAddress,mintAddress,amount) => {
		try {
			const params = {
				payer:wallet.value,
				ownerAddress,
				delegateAddress,
				mintAddress,
				amount,
			};
			const res = await fetch(`${apiUrl}/solana/delegate-token`,{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify(params),
			});

			if (!res.ok) {
				alert('Failed to delegate token',await res.text());
				return;
			}

			const resData = await res.json();
			const tx = await signEncodedTransaction(resData.data.encodedTransaction);
			return {tx};
		} catch (e) {
			console.error('Error delegating token:',e);
			throw e;
		}

	};

	return {
		connectedWallet,
		createToken,
		wallet,
		mintToken,
		transferToken,
		burnToken,
		delegateToken,
	};
});
