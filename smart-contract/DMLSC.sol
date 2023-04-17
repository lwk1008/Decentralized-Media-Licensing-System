pragma solidity ^0.8.17;

contract Mapping {
    //0x90e3Cf8B3077E5d2C83c0F7764836D46cca7376c
    // Mapping from address to uint
    mapping(string => string) public myMap;

    function get(string calldata _addr) public view returns (string memory) {
        // Mapping always returns a value.
        // If the value was never set, it will return the default value.
        return myMap[_addr];
    }

    function set(string calldata _addr, string calldata _i) public {
        // Update the value at this address
        myMap[_addr] = _i;
    }

    function remove(string calldata _addr) public {
        // Reset the value to the default value.
        delete myMap[_addr];
    }
}