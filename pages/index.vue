<script setup>

const solanaStore = useSolanaStore();

const tokenName = ref('TestToken');
const tokenSymbol = ref('TTK');
const tokenDecimals = ref(7);
const mintAddress = ref('G1be5CqZUb4UudNTZWXKvSQ6dkfwLxGXUDcjx8VEtaZm');
const mintRecipient = ref('8zKs2Br4xFYA2pTkRGurPuYdRxtCS61ZzLUD4B6Cmpm3');
const mintAmount = ref(100);
const transferFrom = ref('8zKs2Br4xFYA2pTkRGurPuYdRxtCS61ZzLUD4B6Cmpm3');
const transferTo = ref('4RFG4gnF64dQyH3YFnKjcTcXL7HKosRCsu6GFfGwim5L');
const transferMintAddress = ref('G1be5CqZUb4UudNTZWXKvSQ6dkfwLxGXUDcjx8VEtaZm');
const transferAmount = ref(50);
const burnAddress = ref('ExampleBurnAddress');
const burnMintAddress = ref('G1be5CqZUb4UudNTZWXKvSQ6dkfwLxGXUDcjx8VEtaZm');
const burnAmount = ref(25);
const delegateFrom = ref('ExampleOwnerAddress');
const delegateTo = ref('ExampleDelegateAddress');
const delegateMintAddress = ref('G1be5CqZUb4UudNTZWXKvSQ6dkfwLxGXUDcjx8VEtaZm');
const delegateAmount = ref(30);
const messageTxResult = ref('');
const txLoading = ref({
	createToken:false,
	mintToken:false,
	transferToken:false,
	burnToken:false,
	delegateToken:false,

});

const loadingAndMessageFunction = (key) => {
	txLoading.value[key] = true;
	messageTxResult.value = '';
}

async function createToken(e) {
	try {
		e.preventDefault();
		loadingAndMessageFunction('createToken');
		console.log(tokenName.value,tokenSymbol.value,tokenDecimals.value);
		messageTxResult.value = await solanaStore.createToken(tokenName.value,tokenSymbol.value,tokenDecimals.value);
		txLoading.value['createToken'] = false;
	} catch (e) {
		console.log(e);
		txLoading.value['createToken'] = false;
	}
}

async function mintToken(e) {
	try {
		e.preventDefault();
		loadingAndMessageFunction('mintToken');
		messageTxResult.value = await solanaStore.mintToken(mintAddress.value,mintRecipient.value,mintAmount.value);
		txLoading.value['mintToken'] = false;
	} catch (e) {
		console.log(e);
		txLoading.value['mintToken'] = false;
	}

}

async function transferToken(e) {
	try {
		e.preventDefault();
		loadingAndMessageFunction('transferToken');
		messageTxResult.value = await solanaStore.transferToken(transferFrom.value,transferTo.value,transferMintAddress.value,transferAmount.value);
		txLoading.value['transferToken'] = false;
	} catch (e) {
		console.log(e);
		txLoading.value['transferToken'] = false;
	}
}

async function burnToken(e) {
	try {
		e.preventDefault();
		loadingAndMessageFunction('burnToken');
		messageTxResult.value = await solanaStore.burnToken(burnAddress.value,burnMintAddress.value,burnAmount.value);
		txLoading.value['burnToken'] = false;
	} catch (e) {
		console.log(e);
		txLoading.value['burnToken'] = false;
	}
}

async function delegateToken(e) {
	try {
		e.preventDefault();
		loadingAndMessageFunction('delegateToken');
		console.log(delegateFrom.value,delegateTo.value,delegateMintAddress.value,delegateAmount.value);
		messageTxResult.value = await solanaStore.delegateToken(delegateFrom.value,delegateTo.value,delegateMintAddress.value,delegateAmount.value);
		txLoading.value['delegateToken'] = false;
	} catch (e) {
		txLoading.value['delegateToken'] = false;
		console.log("EEEEEEEEEEEROR");
	}
}
</script>

<template>
	<div class="mt-5 container">
		<h1 class="text-center mb-4">Homework Session 2 - Token Management Dashboard</h1>
		<div class="text-muted small text-center" role="alert">
			Please ensure you are connected to Devnet.
		</div>
		<div class="d-flex justify-content-center mb-4">
			<a href="https://github.com/0xjesus/solana-pulse-front" target="_blank" class="btn btn-link me-2">
				Frontend Repository
			</a>
			<a href="https://github.com/0xjesus/solana-pulse-api" target="_blank" class="btn btn-link">
				Backend Repository
			</a>
		</div>
		<!-- Here create a section with pre and alert type info to show the resultTX -->
		<div v-if="messageTxResult?.tx" class="alert alert-success small" role="alert">
			<div>Transaction submitted successfully.</div>
			<a :href="messageTxResult?.tx" target="_blank">View Transaction</a>
			<div v-if="messageTxResult.mintPublicKey">Token Address:</div>
			<pre v-if="messageTxResult.mintPublicKey"> {{ messageTxResult?.mintPublicKey }}</pre>
		</div>

		<div class="d-flex justify-content-between flex-wrap gap-2">
			<!-- Token Creation Section -->
			<div class="card">
				<div class="card-header">Create Token</div>
				<div class="card-body">
					<form @submit="createToken">
						<div class="mb-3">
							<label for="tokenName" class="form-label">Token Name</label>
							<input
								v-model="tokenName"
								type="text"
								class="form-control"
								id="tokenName"
								placeholder="Enter token name"
							>
						</div>
						<div class="mb-3">
							<label for="tokenSymbol" class="form-label">Token Symbol</label>
							<input
								v-model="tokenSymbol"
								type="text"
								class="form-control"
								id="tokenSymbol"
								placeholder="Enter token symbol"
							>
						</div>
						<div class="mb-3">
							<label for="tokenDecimals" class="form-label">Token Decimals</label>
							<input
								v-model="tokenDecimals"
								type="number"
								class="form-control"
								id="tokenDecimals"
								placeholder="Enter token decimals"
							>
						</div>
						<button type="submit" class="btn btn-primary" :disabled="txLoading['createToken']">
							Create Token
							<span
								v-if="txLoading['createToken']"
								class="spinner-border spinner-border-sm spinner-grow-sm"
								role="status"
								aria-hidden="true"
							>
						</span>
						</button>
					</form>
				</div>
			</div>

			<!-- Token Minting Section -->
			<div class="card ">
				<div class="card-header">Mint Token</div>
				<div class="card-body">
					<form @submit="mintToken">
						<div class="mb-3">
							<label for="mintAddress" class="form-label">Mint Address</label>
							<input
								v-model="mintAddress"
								type="text"
								class="form-control"
								id="mintAddress"
								placeholder="Enter mint address"
							>
						</div>
						<div class="mb-3">
							<label for="mintRecipient" class="form-label">Recipient Address</label>
							<input
								v-model="mintRecipient"
								type="text"
								class="form-control"
								id="mintRecipient"
								placeholder="Enter recipient address"
							>
						</div>
						<div class="mb-3">
							<label for="mintAmount" class="form-label">Amount to Mint</label>
							<input
								v-model="mintAmount"
								type="number"
								class="form-control"
								id="mintAmount"
								placeholder="Enter amount to mint"
							>
						</div>
						<button
							type="submit" class="btn btn-primary"
							:disabled="txLoading['mintToken']"
						>
							Mint Token
							<span
								v-if="txLoading['mintToken']"
								class="spinner-border spinner-border-sm spinner-grow-sm"
								role="status"
								aria-hidden="true"
							></span>
						</button>
					</form>
				</div>
			</div>

			<!-- Token Transfer Section -->
			<div class="card">
				<div class="card-header">Transfer Token</div>
				<div class="card-body">
					<form @submit="transferToken">
						<div class="mb-3">
							<label for="transferFrom" class="form-label">From Address</label>
							<input
								v-model="transferFrom"
								type="text"
								class="form-control"
								id="transferFrom"
								placeholder="Enter sender address"
							>
						</div>
						<div class="mb-3">
							<label for="transferTo" class="form-label">To Address</label>
							<input
								v-model="transferTo"
								type="text"
								class="form-control"
								id="transferTo"
								placeholder="Enter recipient address"
							>
						</div>
						<div class="mb-3">
							<label for="transferMintAddress" class="form-label">Mint Address</label>
							<input
								v-model="transferMintAddress"
								type="text"
								class="form-control"
								id="transferMintAddress"
								placeholder="Enter mint address"
							>
						</div>
						<div class="mb-3">
							<label for="transferAmount" class="form-label">Amount to Transfer</label>
							<input
								v-model="transferAmount"
								type="number"
								class="form-control"
								id="transferAmount"
								placeholder="Enter amount to transfer"
							>
						</div>
						<button
							type="submit" class="btn btn-primary"
							:disabled="txLoading['transferToken']"
						>
							Transfer Token
							<span
								v-if="txLoading['transferToken']"
								class="spinner-border spinner-border-sm spinner-grow-sm"
								role="status"
								aria-hidden="true"
							></span>
						</button>
					</form>
				</div>
			</div>

			<!-- Token Burning Section -->
			<div class="card">
				<div class="card-header">Burn Token</div>
				<div class="card-body">
					<form @submit="burnToken">
						<div class="mb-3">
							<label for="burnAddress" class="form-label">Address</label>
							<input
								v-model="burnAddress"
								type="text"
								class="form-control"
								id="burnAddress"
								placeholder="Enter address"
							>
						</div>
						<div class="mb-3">
							<label for="burnMintAddress" class="form-label">Mint Address</label>
							<input
								v-model="burnMintAddress"
								type="text"
								class="form-control"
								id="burnMintAddress"
								placeholder="Enter mint address"
							>
						</div>
						<div class="mb-3">
							<label for="burnAmount" class="form-label">Amount to Burn</label>
							<input
								v-model="burnAmount"
								type="number"
								class="form-control"
								id="burnAmount"
								placeholder="Enter amount to burn"
							>
						</div>
						<button
							type="submit" class="btn btn-danger btn-primary"
							:disabled="txLoading['burnToken']"
						>
							Burn Token
							<span
								v-if="txLoading['burnToken']"
								class="spinner-border spinner-border-sm spinner-grow-sm"
								role="status"
								aria-hidden="true"
							></span>
						</button>
					</form>
				</div>
			</div>

			<!-- Token Delegation Section -->
			<div class="card ">
				<div class="card-header">Delegate Token</div>
				<div class="card-body">
					<form @submit="delegateToken">
						<div class="mb-3">
							<label for="delegateFrom" class="form-label">Owner Address</label>
							<input
								v-model="delegateFrom"
								type="text"
								class="form-control"
								id="delegateFrom"
								placeholder="Enter owner address"
							>
						</div>
						<div class="mb-3">
							<label for="delegateTo" class="form-label">Delegate Address</label>
							<input
								v-model="delegateTo"
								type="text"
								class="form-control"
								id="delegateTo"
								placeholder="Enter delegate address"
							>
						</div>
						<div class="mb-3">
							<label for="delegateMintAddress" class="form-label">Mint Address</label>
							<input
								v-model="delegateMintAddress"
								type="text"
								class="form-control"
								id="delegateMintAddress"
								placeholder="Enter mint address"
							>
						</div>
						<div class="mb-3">
							<label for="delegateAmount" class="form-label">Amount to Delegate</label>
							<input
								v-model="delegateAmount"
								type="number"
								class="form-control"
								id="delegateAmount"
								placeholder="Enter amount to delegate"
							>
						</div>
						<button type="submit" class="btn btn-primary" :disabled="txLoading['delegateToken']">
							Delegate Token
							<span
								v-if="txLoading['delegateToken']"
								class="spinner-border spinner-border-sm spinner-grow-sm"
								role="status"
								aria-hidden="true"
							></span>
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="sass">
a
	color: #1b8e00

</style>
