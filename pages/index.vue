<script setup>

const solanaStore = useSolanaStore();

const tokenName = ref('TestToken');
const tokenSymbol = ref('TTK');
const tokenDecimals = ref(2);
const mintAddress = ref('ExampleMintAddress');
const mintRecipient = ref('ExampleRecipientAddress');
const mintAmount = ref(100);
const transferFrom = ref('ExampleFromAddress');
const transferTo = ref('ExampleToAddress');
const transferMintAddress = ref('ExampleMintAddress');
const transferAmount = ref(50);
const burnAddress = ref('ExampleBurnAddress');
const burnMintAddress = ref('ExampleMintAddress');
const burnAmount = ref(25);
const delegateFrom = ref('ExampleOwnerAddress');
const delegateTo = ref('ExampleDelegateAddress');
const delegateMintAddress = ref('ExampleMintAddress');
const delegateAmount = ref(30);

async function createToken(e) {
  e.preventDefault();
  console.log(tokenName.value, tokenSymbol.value, tokenDecimals.value);
  await solanaStore.createToken(tokenName.value, tokenSymbol.value, tokenDecimals.value);
}

async function mintToken(e) {
  e.preventDefault();
  await solanaStore.mintToken(mintAddress.value, mintRecipient.value, mintAmount.value);
}

async function transferToken(e) {
  e.preventDefault();
  await solanaStore.transferToken(transferFrom.value, transferTo.value, transferMintAddress.value, transferAmount.value);
}

async function burnToken(e) {
  e.preventDefault();
  await solanaStore.burnToken(burnAddress.value, burnMintAddress.value, burnAmount.value);
}

async function delegateToken(e) {
  e.preventDefault();
  await solanaStore.delegateToken(delegateFrom.value, delegateTo.value, delegateMintAddress.value, delegateAmount.value);
}
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">HomeWork Session 2 - Token Management Dashboard</h1>

    <!-- Token Creation Section -->
    <div class="card mb-4">
      <div class="card-header">Create Token</div>
      <div class="card-body">
        <form @submit="createToken">
          <div class="mb-3">
            <label for="tokenName" class="form-label">Token Name</label>
            <input v-model="tokenName" type="text" class="form-control" id="tokenName" placeholder="Enter token name">
          </div>
          <div class="mb-3">
            <label for="tokenSymbol" class="form-label">Token Symbol</label>
            <input v-model="tokenSymbol" type="text" class="form-control" id="tokenSymbol" placeholder="Enter token symbol">
          </div>
          <div class="mb-3">
            <label for="tokenDecimals" class="form-label">Token Decimals</label>
            <input v-model="tokenDecimals" type="number" class="form-control" id="tokenDecimals" placeholder="Enter token decimals">
          </div>
          <button type="submit" class="btn btn-primary">Create Token</button>
        </form>
      </div>
    </div>

    <!-- Token Minting Section -->
    <div class="card mb-4">
      <div class="card-header">Mint Token</div>
      <div class="card-body">
        <form @submit="mintToken">
          <div class="mb-3">
            <label for="mintAddress" class="form-label">Mint Address</label>
            <input v-model="mintAddress" type="text" class="form-control" id="mintAddress" placeholder="Enter mint address">
          </div>
          <div class="mb-3">
            <label for="mintRecipient" class="form-label">Recipient Address</label>
            <input v-model="mintRecipient" type="text" class="form-control" id="mintRecipient" placeholder="Enter recipient address">
          </div>
          <div class="mb-3">
            <label for="mintAmount" class="form-label">Amount to Mint</label>
            <input v-model="mintAmount" type="number" class="form-control" id="mintAmount" placeholder="Enter amount to mint">
          </div>
          <button type="submit" class="btn btn-primary">Mint Token</button>
        </form>
      </div>
    </div>

    <!-- Token Transfer Section -->
    <div class="card mb-4">
      <div class="card-header">Transfer Token</div>
      <div class="card-body">
        <form @submit="transferToken">
          <div class="mb-3">
            <label for="transferFrom" class="form-label">From Address</label>
            <input v-model="transferFrom" type="text" class="form-control" id="transferFrom" placeholder="Enter sender address">
          </div>
          <div class="mb-3">
            <label for="transferTo" class="form-label">To Address</label>
            <input v-model="transferTo" type="text" class="form-control" id="transferTo" placeholder="Enter recipient address">
          </div>
          <div class="mb-3">
            <label for="transferMintAddress" class="form-label">Mint Address</label>
            <input v-model="transferMintAddress" type="text" class="form-control" id="transferMintAddress" placeholder="Enter mint address">
          </div>
          <div class="mb-3">
            <label for="transferAmount" class="form-label">Amount to Transfer</label>
            <input v-model="transferAmount" type="number" class="form-control" id="transferAmount" placeholder="Enter amount to transfer">
          </div>
          <button type="submit" class="btn btn-primary">Transfer Token</button>
        </form>
      </div>
    </div>

    <!-- Token Burning Section -->
    <div class="card mb-4">
      <div class="card-header">Burn Token</div>
      <div class="card-body">
        <form @submit="burnToken">
          <div class="mb-3">
            <label for="burnAddress" class="form-label">Address</label>
            <input v-model="burnAddress" type="text" class="form-control" id="burnAddress" placeholder="Enter address">
          </div>
          <div class="mb-3">
            <label for="burnMintAddress" class="form-label">Mint Address</label>
            <input v-model="burnMintAddress" type="text" class="form-control" id="burnMintAddress" placeholder="Enter mint address">
          </div>
          <div class="mb-3">
            <label for="burnAmount" class="form-label">Amount to Burn</label>
            <input v-model="burnAmount" type="number" class="form-control" id="burnAmount" placeholder="Enter amount to burn">
          </div>
          <button type="submit" class="btn btn-danger">Burn Token</button>
        </form>
      </div>
    </div>

    <!-- Token Delegation Section -->
    <div class="card mb-4">
      <div class="card-header">Delegate Token</div>
      <div class="card-body">
        <form @submit="delegateToken">
          <div class="mb-3">
            <label for="delegateFrom" class="form-label">Owner Address</label>
            <input v-model="delegateFrom" type="text" class="form-control" id="delegateFrom" placeholder="Enter owner address">
          </div>
          <div class="mb-3">
            <label for="delegateTo" class="form-label">Delegate Address</label>
            <input v-model="delegateTo" type="text" class="form-control" id="delegateTo" placeholder="Enter delegate address">
          </div>
          <div class="mb-3">
            <label for="delegateMintAddress" class="form-label">Mint Address</label>
            <input v-model="delegateMintAddress" type="text" class="form-control" id="delegateMintAddress" placeholder="Enter mint address">
          </div>
          <div class="mb-3">
            <label for="delegateAmount" class="form-label">Amount to Delegate</label>
            <input v-model="delegateAmount" type="number" class="form-control" id="delegateAmount" placeholder="Enter amount to delegate">
          </div>
          <button type="submit" class="btn btn-primary">Delegate Token</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí si es necesario */
</style>
