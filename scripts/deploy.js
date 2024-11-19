async function main() {
    // Get the contract factory
    const CharityDonation = await hre.ethers.getContractFactory("CharityDonation");

    // Deploy the contract
    const charity = await CharityDonation.deploy();

    // Wait for the deployment to be mined
    await charity.deployed();

    // Log the contract address
    console.log("CharityDonation deployed to:", charity.address);
}

// Run the main function and catch any errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
