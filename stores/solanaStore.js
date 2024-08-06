import {defineStore} from 'pinia';
import {Connection,Transaction} from '@solana/web3.js';
import {useWallet} from "solana-wallets-vue";

export const useSolanaStore = defineStore('solanaStore',() => {

	const wallet = ref('');

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
			alert('Invalid transaction');
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
			alert(`https://solscan.io/tx/${txid}?cluster=devnet`);
			return txid;
		} catch (error) {
			console.error('Transaction signing failed:',error);
			alert('Transaction signing failed', error);
			return;
		}
	}

	const callApi = async (action,params) => {
		const {data,error} = await useFetch('/api/token',{
			method:'POST',
			body:{action,params},
		});

		if (error.value) {
			throw createError({statusCode:500,statusMessage:error.value.message});
		}

		return data.value;
	};

	const createToken = async (name,symbol,decimals) => {
		const params = {payer:wallet.value,name,symbol,decimals};
		const {transaction} = await callApi('create',params);
		return await signEncodedTransaction(transaction);
	};

	const mintToken = async (mintAddress,recipientAddress,amount) => {
		const params = {
			payer:wallet.value,
			mintAddress,
			recipientAddress,
			amount,
		};
		const {transaction} = await callApi('mint',params);
		const tx = transaction instanceof Transaction ? transaction : Transaction.from(transaction.data);
		return await signEncodedTransaction(tx);
	};

	const transferToken = async (fromAddress,toAddress,mintAddress,amount) => {
		const params = {
			payer:wallet.value,
			fromAddress,
			toAddress,
			mintAddress,
			amount,
		};
		const {transaction} = await callApi('transfer',params);
		const tx = transaction instanceof Transaction ? transaction : Transaction.from(transaction.data);
		return await signEncodedTransaction(tx);
	};

	const burnToken = async (accountAddress,mintAddress,amount) => {
		const params = {
			payer:wallet.value,
			accountAddress,
			mintAddress,
			amount,
		};
		const {transaction} = await callApi('burn',params);
		const tx = transaction instanceof Transaction ? transaction : Transaction.from(transaction.data);
		return await signEncodedTransaction(tx);
	};

	const delegateToken = async (ownerAddress,delegateAddress,mintAddress,amount) => {
		const params = {
			payer:wallet.value,
			ownerAddress,
			delegateAddress,
			mintAddress,
			amount,
		};
		const {transaction} = await callApi('delegate',params);
		const tx = transaction instanceof Transaction ? transaction : Transaction.from(transaction.data);
		return await signEncodedTransaction(tx);
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
