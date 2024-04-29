package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"
	// "reflect"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}


type User struct {
	ID       string `json:"ID"`
	Password string `json:"Password"`
	Acc_Type string `json:"Acc_Type"`
	Money    string `json:"Money"`
	Typo     string `json:"Typo"`
}

type Contract struct {
	ID          string `json:"ID"`
	Employer_ID string `json:"Employer_ID"`
	Employee_ID string `json:"Employee_ID"`
	Salary      string `json:"Salary"`
	Is_Running  string `json:"Is_Running"`
	Typo        string `json:"Typo"`
}

// InitLedger adds a base set of assets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	users := []User{
		{ID: "user1",  Password: "pass1", Acc_Type: "Employer", Money: "54", Typo: "User"},
		{ID: "user2",  Password: "pass2", Acc_Type: "Employee", Money: "5454", Typo: "User"},
	}

	contracts := []Contract{
		{ID: "user1user2",  Employer_ID: "user1", Employee_ID: "user2", Salary: "5", Is_Running: "0", Typo : "Contract"},
	}

	for _, user := range users {
		userJSON, err := json.Marshal(user)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(user.ID, userJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	for _, contract := range contracts {
		contractJSON, err := json.Marshal(contract)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(contract.ID, contractJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

// CreateUser signs up a new user to the world state with given details.
func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, id string, password string, money string, acc_type string) error {
	exists, err := s.UserExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the user %s already exists", id)
	}

	user := User{
		ID:       id,
		Acc_Type: acc_type,
		Password: password,
		Money:    money,
		Typo:     "User",
	}
	userJSON, err := json.Marshal(user)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, userJSON)
}

// CreateUser signs up a new user to the world state with given details.
func (s *SmartContract) CreateContract(ctx contractapi.TransactionContextInterface, employer_id string, employee_id string, salary string, is_running string) error {
	exists, err := s.ContractExists(ctx, employer_id+employee_id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the contract %s already exists", employer_id+employee_id)
	}

	contract := Contract{
		ID:          employer_id + employee_id,
		Employer_ID: employer_id,
		Employee_ID: employee_id,
		Salary:      salary,
		Is_Running:  is_running,
		Typo:        "Contract",
	}
	contractJSON, err := json.Marshal(contract)
	if err != nil {
		return err
	}

	fmt.Println(employer_id+employee_id)
	return ctx.GetStub().PutState(employer_id+employee_id, contractJSON)
}

// ReadUser returns the asset stored in the world state with given id.
func (s *SmartContract) ReadUser(ctx contractapi.TransactionContextInterface, id string) (*User, error) {
	userJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if userJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", id)
	}

	var user User
	err = json.Unmarshal(userJSON, &user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// ReadContract returns the asset stored in the world state with given id.
func (s *SmartContract) ReadContract(ctx contractapi.TransactionContextInterface, id string) (*Contract, error) {
	contractJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if contractJSON == nil {
		return nil, fmt.Errorf("the contract %s does not exist", id)
	}

	var contract Contract
	err = json.Unmarshal(contractJSON, &contract)
	if err != nil {
		return nil, err
	}

	return &contract, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
// func (s *SmartContract) RunContract(ctx contractapi.TransactionContextInterface, id string) error {
// 	contractJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return fmt.Errorf("failed to read from world state: %v", err)
// 	}
// 	if contractJSON == nil {
// 		return fmt.Errorf("the contract %s does not exist", id)
// 	}

// 	// overwriting original asset with new asset
// 	asset := Asset{
// 		ID:             id,
// 		Color:          color,
// 		Size:           size,
// 		Owner:          owner,
// 		AppraisedValue: appraisedValue,
// 	}
// 	assetJSON, err := json.Marshal(asset)
// 	if err != nil {
// 		return err
// 	}

// 	return ctx.GetStub().PutState(id, assetJSON)
// }

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *SmartContract) TransferMoney(ctx contractapi.TransactionContextInterface, employer_id string, employee_id string) error {
	contract, err0 := s.ReadContract(ctx, employer_id+employee_id)
	employer, err1 := s.ReadUser(ctx, employer_id)
	employee, err2 := s.ReadUser(ctx, employee_id)

	if err0 != nil {
		return err0
	}

	if err1 != nil {
		return err1
	}

	if err2 != nil {
		return err2
	}

	salary, _ := strconv.Atoi(contract.Salary)
	intValue1, _ := strconv.Atoi(employer.Money)
	intValue2, _ := strconv.Atoi(employee.Money)
	employer.Money = strconv.Itoa(intValue1 - salary)
	employee.Money = strconv.Itoa(intValue2 + salary)

	userJSON, err := json.Marshal(employer)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(employer_id, userJSON)
	if err != nil {
		return err
	}

	userJSON, err = json.Marshal(employee)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(employee_id, userJSON)
	if err != nil {
		return err
	}

	return nil
}

// // DeleteAsset deletes an given asset from the world state.
// func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {
// 	exists, err := s.AssetExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the asset %s does not exist", id)
// 	}

// 	return ctx.GetStub().DelState(id)
// }

// User Valid Function
func (s *SmartContract) UserValid(ctx contractapi.TransactionContextInterface, id string, password string) (bool, error) {
	userJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	if userJSON == nil {
		return false, nil
	}
	var user User

	err = json.Unmarshal(userJSON, &user)
	if password != user.Password {
		return false, nil
	}
	if err!=nil {
		return false , err
	}
	return userJSON != nil, nil
}

// User Exist Function
func (s *SmartContract) UserExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	userJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return userJSON != nil, nil
}

// Contract Exist Function
func (s *SmartContract) ContractExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	contractJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return contractJSON != nil, nil
}


// GetAllAssets returns all assets found in world state
func (s *SmartContract) GetAllContracts(ctx contractapi.TransactionContextInterface) ([]*Contract, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// var contracts []*Contract
	var contracts []*Contract

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		fmt.Println("xyz")
		var contract Contract
		_ = json.Unmarshal(queryResponse.Value, &contract)
		if contract.Typo == "Contract" {
			contracts = append(contracts, &contract)
		}
	}

	return contracts, nil
}

func (s *SmartContract) GetAllUsers(ctx contractapi.TransactionContextInterface) ([]*User, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// var contracts []*Contract
	var users []*User

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		fmt.Println("xyz")
		var user User
		_ = json.Unmarshal(queryResponse.Value, &user)
		if user.Typo == "User" {
			users = append(users, &user)
		}
	}

	return users, nil
}
