import {Connection,Transaction,PublicKey,SystemProgram} from '@solana/web3.js';
import {
	createMintToInstruction,
	createTransferInstruction,
	createBurnInstruction,
	createApproveInstruction,
	createCreateNativeMintInstruction,
	TOKEN_PROGRAM_ID,
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
	createNativeMintInstructionData
} from '@solana/spl-token';

export default defineEventHandler(async (event) => {

	const body = await readBody(event);

	const connection = new Connection('https://api.devnet.solana.com','confirmed');

	const {action,params} = body;

	let transaction = new Transaction();

	try {
		switch (action) {
			case 'create': {
				const {payer,decimals} = params;
				if (!payer || !decimals) {
					throw new Error('Missing parameters for token creation');
				}
				transaction = await createToken(transaction,connection,payer,decimals);
				console.log('Token creation transaction prepared:',transaction);
				break;
			}
			case 'mint': {
				const {payer,mintAddress,recipientAddress,amount} = params;
				console.log('Minting token with:',{payer,mintAddress,recipientAddress,amount});
				if (!payer || !mintAddress || !recipientAddress || !amount) {
					console.error('Missing parameters for minting',{payer,mintAddress,recipientAddress,amount});
					throw new Error('Missing parameters for minting');
				}
				transaction = await mintToken(transaction,connection,payer,mintAddress,recipientAddress,amount);
				console.log('Mint transaction prepared:',transaction);
				break;
			}
			case 'transfer': {
				const {payer,fromAddress,toAddress,mintAddress,amount} = params;
				console.log('Transferring token with:',{payer,fromAddress,toAddress,mintAddress,amount});
				if (!payer || !fromAddress || !toAddress || !mintAddress || !amount) {
					console.error('Missing parameters for transfer',{payer,fromAddress,toAddress,mintAddress,amount});
					throw new Error('Missing parameters for transfer');
				}
				transaction = await transferToken(transaction,connection,payer,fromAddress,toAddress,mintAddress,amount);
				console.log('Transfer transaction prepared:',transaction);
				break;
			}
			case 'burn': {
				const {payer,accountAddress,mintAddress,amount} = params;
				console.log('Burning token with:',{payer,accountAddress,mintAddress,amount});
				if (!payer || !accountAddress || !mintAddress || !amount) {
					console.error('Missing parameters for burning',{payer,accountAddress,mintAddress,amount});
					throw new Error('Missing parameters for burning');
				}
				transaction = await burnToken(transaction,connection,payer,accountAddress,mintAddress,amount);
				console.log('Burn transaction prepared:',transaction);
				break;
			}
			case 'delegate': {
				const {payer,ownerAddress,delegateAddress,mintAddress,amount} = params;
				console.log('Delegating token with:',{payer,ownerAddress,delegateAddress,mintAddress,amount});
				if (!payer || !ownerAddress || !delegateAddress || !mintAddress || !amount) {
					console.error('Missing parameters for approval',{
						payer,
						ownerAddress,
						delegateAddress,
						mintAddress,
						amount
					});
					throw new Error('Missing parameters for approval');
				}
				transaction = await delegateToken(transaction,connection,payer,ownerAddress,delegateAddress,mintAddress,amount);
				console.log('Delegate transaction prepared:',transaction);
				break;
			}
			default:
				console.error('Invalid action:',action);
				throw new Error('Invalid action');
		}
		const {blockhash} = await connection.getRecentBlockhash();
		transaction.recentBlockhash = blockhash;
		// Set the fee payer
		const {payer} = params;
		transaction.feePayer = new PublicKey(payer);
		const serializedTransaction = transaction.serialize({requireAllSignatures:false});
		const encodedTransaction = serializedTransaction.toString('base64');

		return {transaction:encodedTransaction};
	} catch (error) {
		console.error('Error handling request:',error);
		throw createError({
			statusCode:500,
			statusMessage:error.message,
		});
	}
});

async function createToken(transaction,connection,payer,decimals) {
	console.log('Inside createToken function with:',payer,decimals);
	const payerPublicKey = new PublicKey(payer);
	console.log('----------------> Payer public key:',payerPublicKey);

	const seed = "mint";
	if (!TOKEN_PROGRAM_ID) {
		throw new Error('TOKEN_PROGRAM_ID is not defined');
	}
	console.log('----------------> **** TOKEN_PROGRAM ID:',TOKEN_PROGRAM_ID);
	const mintPublicKey = await PublicKey.createWithSeed(payerPublicKey,seed,TOKEN_PROGRAM_ID);
	console.log('----------------> **** Mint public key:',mintPublicKey);

	const mintInstruction = createCreateNativeMintInstruction(
		payerPublicKey,
		mintPublicKey,
		SystemProgram.programId)

	transaction.add(mintInstruction);
	return {transaction, mintPublicKey};
}

async function mintToken(transaction,connection,payer,mintAddress,recipientAddress,amount) {
	console.log('Inside mintToken function with:',{connection,payer,mintAddress,recipientAddress,amount});
	const payerPublicKey = new PublicKey(payer);
	const mintPublicKey = new PublicKey(mintAddress);
	const recipientPublicKey = new PublicKey(recipientAddress);

	console.log('Public keys:',{payerPublicKey,mintPublicKey,recipientPublicKey});

	const recipientTokenAddress = await getAssociatedTokenAddress(
		mintPublicKey,
		recipientPublicKey
	);

	const recipientTokenAccountInfo = await connection.getAccountInfo(recipientTokenAddress);
	if (!recipientTokenAccountInfo) {
		console.log('Creating recipient token account');
		const createRecipientTokenAccountInstruction = createAssociatedTokenAccountInstruction(
			payerPublicKey,
			recipientTokenAddress,
			recipientPublicKey,
			mintPublicKey
		);
		transaction.add(createRecipientTokenAccountInstruction);
	} else {
		console.log('Recipient token account already exists');
	}

	const mintToInstruction = createMintToInstruction(
		mintPublicKey,
		recipientTokenAddress,
		payerPublicKey,
		amount,
		[]
	);

	transaction.add(mintToInstruction);
	return transaction;
}

async function transferToken(transaction,connection,payer,fromAddress,toAddress,mintAddress,amount) {
	console.log('Inside transferToken function with:',{connection,payer,fromAddress,toAddress,mintAddress,amount});
	const fromPublicKey = new PublicKey(fromAddress);
	const toPublicKey = new PublicKey(toAddress);
	const mintPublicKey = new PublicKey(mintAddress);
	const payerPublicKey = new PublicKey(payer);

	console.log('Public keys:',{fromPublicKey,toPublicKey,mintPublicKey,payerPublicKey});

	const fromTokenAddress = await getAssociatedTokenAddress(
		mintPublicKey,
		fromPublicKey
	);

	const toTokenAddress = await getAssociatedTokenAddress(
		mintPublicKey,
		toPublicKey
	);

	const toTokenAccountInfo = await connection.getAccountInfo(toTokenAddress);
	if (!toTokenAccountInfo) {
		console.log('Creating destination token account');
		const createToTokenAccountInstruction = createAssociatedTokenAccountInstruction(
			payerPublicKey,
			toTokenAddress,
			toPublicKey,
			mintPublicKey
		);
		transaction.add(createToTokenAccountInstruction);
	} else {
		console.log('Destination token account already exists');
	}

	const transferInstruction = createTransferInstruction(
		fromTokenAddress,
		toTokenAddress,
		payerPublicKey,
		amount,
		[]
	);

	transaction.add(transferInstruction);
	return transaction;
}

async function burnToken(transaction,connection,payer,accountAddress,mintAddress,amount) {
	console.log('Inside burnToken function with:',{connection,payer,accountAddress,mintAddress,amount});
	const accountPublicKey = new PublicKey(accountAddress);
	const mintPublicKey = new PublicKey(mintAddress);
	const payerPublicKey = new PublicKey(payer);

	console.log('Public keys:',{accountPublicKey,mintPublicKey,payerPublicKey});

	const newTransaction = new Transaction().add(
		createBurnInstruction(
			accountPublicKey,
			mintPublicKey,
			payerPublicKey,
			amount,
			[]
		)
	);

	console.log('Burn transaction created:',newTransaction);
	return newTransaction;
}

async function delegateToken(transaction,connection,payer,ownerAddress,delegateAddress,mintAddress,amount) {
	console.log('Inside delegateToken function with:',{
		connection,
		payer,
		ownerAddress,
		delegateAddress,
		mintAddress,
		amount
	});
	const ownerPublicKey = new PublicKey(ownerAddress);
	const delegatePublicKey = new PublicKey(delegateAddress);
	const mintPublicKey = new PublicKey(mintAddress);
	const payerPublicKey = new PublicKey(payer);

	console.log('Public keys:',{ownerPublicKey,delegatePublicKey,mintPublicKey,payerPublicKey});

	const tokenAccount = await getAssociatedTokenAddress(
		mintPublicKey,
		ownerPublicKey
	);

	const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);
	if (!tokenAccountInfo) {
		console.log('Creating token account');
		const createTokenAccountInstruction = createAssociatedTokenAccountInstruction(
			payerPublicKey,
			tokenAccount,
			ownerPublicKey,
			mintPublicKey
		);
		transaction.add(createTokenAccountInstruction);
	}

	const approveInstruction = createApproveInstruction(
		tokenAccount,
		delegatePublicKey,
		ownerPublicKey,
		amount,
		[]
	);

	transaction.add(approveInstruction);
	return transaction;
}
