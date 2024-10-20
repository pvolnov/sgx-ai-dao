// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/token/ERC20/utils/SafeERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/utils/cryptography/ECDSA.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}


contract XaiDao {
    using SafeERC20 for IERC20;

    address public immutable owner;
    address public immutable tokenAddress;
    address public immutable verifierAddress;
    address public immutable daoRegister;
    string public manifest;
    uint256 public lastUsedTimestamp;
    uint256 public closeDelay;

    mapping(bytes32 => bool) public transactions;
    mapping(bytes32 => bool) public requests;

    event TokensSent(address indexed to, uint256 amount, bytes32 dataHash);
    event TokensSwapped(address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut);

    constructor(
        address _tokenAddress,
        address _verifierAddress,
        string memory _manifest,
        uint256 _closeDelay,
        address _daoRegister
    ) {
        require(_verifierAddress != address(0), "Invalid verifier address");
        require(_tokenAddress != address(0), "Invalid token address");

        tokenAddress = _tokenAddress;
        verifierAddress = _verifierAddress;
        manifest = _manifest;
        daoRegister = _daoRegister;
        lastUsedTimestamp = block.timestamp;
        owner = msg.sender;
        closeDelay = _closeDelay;

        (bool success, bytes memory returnData) = daoRegister.call(abi.encodeWithSignature("verifyNewDao()"));
        require(success, "Call to verifyNewDao failed");
    }

    function _verify(bytes32 _hash, bytes memory _signature) internal view returns (bool) {
        return ECDSA.recover(_hash, _signature) == verifierAddress;
    }

    function payForRequest(bytes32 request_id) payable external {
        require(msg.value > 0, "Amount must be greater than zero");
        requests[request_id] = true;
        lastUsedTimestamp = block.timestamp;
        payable(daoRegister).transfer(msg.value);
    }

    function send(
        address _to,
        uint256 _amount,
        bytes32 _dataHash,
        bytes memory _signature
    ) external {
        require(_to != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than zero");

        bytes32 hash = keccak256(abi.encode(_to, _amount, address(this), _dataHash));

        require(_verify(hash, _signature), "Invalid signature");
        require(!transactions[hash], "Transaction already used");

        transactions[hash] = true;
        lastUsedTimestamp = block.timestamp;

        IERC20(tokenAddress).safeTransfer(_to, _amount);
        emit TokensSent(_to, _amount, _dataHash);
    }

    function toHexString(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i * 2] = alphabet[uint8(data[i] >> 4)];
            str[1 + i * 2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }

    function close() external {
        require(lastUsedTimestamp + closeDelay < block.timestamp, "Cannot close yet");
        IERC20(tokenAddress).safeTransfer(owner, IERC20(tokenAddress).balanceOf(address(this)));
    }

    function swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 deadline,
        bytes memory _signature,
        address uniswapRouterAddress
    ) external {
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid token addresses");
        require(amountIn > 0, "Amount in must be greater than zero");
        require(deadline >= block.timestamp, "Deadline has passed");

        bytes32 hash = keccak256(abi.encode(tokenIn, tokenOut, amountIn, amountOutMin, deadline, address(this)));
        require(_verify(hash, _signature), "Invalid signature");
        require(!transactions[hash], "Transaction already used");

        transactions[hash] = true;
        lastUsedTimestamp = block.timestamp;
        IERC20(tokenIn).safeApprove(uniswapRouterAddress, amountIn);

        address [] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        IUniswapV2Router02 router = IUniswapV2Router02(uniswapRouterAddress);

        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );

        emit TokensSwapped(tokenIn, tokenOut, amounts[0], amounts[1]);
    }
}
