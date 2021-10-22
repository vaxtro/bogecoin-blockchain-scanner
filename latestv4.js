const apiKey = ["4R1WTVBW3V1F4HWPTPR4BFS1ZI4KVW5VVB", "BVJFAWFIDFW39DJXBJJWBHX9I2PZG76V5K", "C856KYYFD7CBAYN2B4E5CP5QPU9F8QUWNY", "U3CUB11SR31BW3KR8ER53SZ7YF5HV6B9ST", "35XPVQKCPW7SVXKVIC5EH246VVVHWJRSJ3", "S289WFIZZKSKCUZANKQAWBGPX2XPTPSVRB", "G4HKX6MXDKTPSZP5ZU2JEZJQ3PGIGU4NCY", "G5BUR9EDFAS6BH7W7CP5B4MVHRWY552QS5", "KDVNDKX6JRQ962JN2CEA8CIFBZDF8B82D7"];
const bContract = "0x248c45af3b2f73bc40fa159f2a90ce9cad7a77ba";
const pageTime = 5000; //checks page every 500ms
var intervalID;
const pancakeswapAddress = "0x15ef0be23194e4f21a4c4b871a78985c38e0ce39";
var apiKeyChosen = apiKey[Math.floor(Math.random() * 8)];
var startBlock = 0;
var blockLastBlockPage;
var blockLoad = [];
var latestBlockInfo;
var latestAddTR = 0;
var loopID;
var bnbPrice;
var txHash;
var bnbAmount;
var txLoad;
var txLoadHash;
var txHashOne;
var txAmountOne;
var burnData;
var initSupply
var beginSupply;
var currentSupply;
var initData;
var burnAmnt;
var initBurnData;
var initBurn;
var totalBurn;
var totalCurrent;
var totalInitBurn;
var totalNewBurn;
var newBurnAmnt;
var txToFind
var txData;
var hashLogged;
var blockLogged;
var fromLogged;
var toLogged;
var addressCheckLoad;
var hashDataFound;
var bogePrice;
var amountSentTotal;
var loadToggle = false;
var isLoad = false;
var txTypeOne;
var trueBogePriceUSD;
var trueBogePriceBNB;

function addDec(num, dec) {
    return (num / dec).toFixed(2);
}

function addDecPrecise(num, dec) {
    return (num / dec).toFixed(5);
}

function getLatestJSON() {
    const getBlockURL = "https://api.bscscan.com/api?module=account&action=tokentx&address="+pancakeswapAddress+"&startblock="+startBlock+"&endblock=25000000000000&sort=asc&apikey="+apiKeyChosen;
    $.getJSON(getBlockURL, function(data) {
        console.log(data.result);
        blockLoad.push(data.result);
        blockLoad = blockLoad[0];
        console.log(blockLoad);

        let dataLength = blockLoad.length;
        
        blockLastBlockPage = blockLoad[dataLength-1];
        console.log(blockLastBlockPage);

        startBlock = blockLastBlockPage.blockNumber
        console.log(startBlock);

        if (dataLength < 10000) {
            console.log("cleared");
            clearInterval(intervalID);

            blockLoad = $.grep(blockLoad, function(e) { return e.tokenSymbol!="WBNB" });
            console.log(blockLoad);
            for (i = 0; i < 12; i++) {
                var maxTest = getMax(blockLoad, "timeStamp");
                console.log(maxTest.timeStamp);

                latestBlockInfo = blockLoad.find(element => element.timeStamp == maxTest.timeStamp);
                console.log(latestBlockInfo);

                let latestNthChild = 2 + latestAddTR;

                txHash = latestBlockInfo.hash;

                $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(1) a").html(txHash);

                txHashOne = $(".recentTable tr:nth-child(2) td:nth-child(1) a").text();

                $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(1) a").attr("href", "https://bscscan.com/tx/" + latestBlockInfo.hash);

                let blockTimeStamp = latestBlockInfo.timeStamp;
                var date = new Date(blockTimeStamp * 1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();

                var blockTimeStampConverted = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                console.log(blockTimeStampConverted);

                $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(2)").html(blockTimeStampConverted);

                if (latestBlockInfo.from == pancakeswapAddress) {
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").html("Buy");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-transfer");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-sell");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-buy");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").addClass("em-buy");
                } else if (latestBlockInfo.to == pancakeswapAddress) {
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").html("Sell");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-transfer");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-sell");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-buy");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").addClass("em-sell");
                } else {
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").html("Transfer");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-transfer");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-sell");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").removeClass("em-buy");
                    $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(3) em").addClass("em-transfer");
                }

                txTypeOne = $(".recentTable tr:nth-child(2) td:nth-child(3) em").text();

                var amountSent = addDec(latestBlockInfo.value, 1000000000);

                $(".recentTable tr:nth-child("+latestNthChild+") td:nth-child(4)").html(amountSent);

                txAmountOne = $(".recentTable tr:nth-child(2) td:nth-child(4)").text();
                txAmountOne = parseFloat(txAmountOne);

                blockLoad = $.grep(blockLoad, function(e) { return e.hash!=latestBlockInfo.hash });

                latestAddTR++;


                if (i == 11) {

                    if (loopID) {
                        console.log("cleared loop")
                        clearInterval(loopID);
                    }

                    clearInterval(loopID);
                    console.log("will refresh");

                    const getBNBPriceURL = "https://api.bscscan.com/api?module=stats&action=bnbprice&apikey="+apiKeyChosen;
                    $.getJSON(getBNBPriceURL, function(data) {
                        console.log(data.result);
                        bnbPrice = data.result.ethusd;
                        console.log(bnbPrice);

                    })
                        .done(function() {
                            const getTXHASHURL = "https://api.bscscan.com/api?module=account&action=tokentx&address="+pancakeswapAddress+"&startblock="+startBlock+"&endblock=25000000000000&sort=asc&apikey="+apiKeyChosen;
                            $.getJSON(getTXHASHURL, function(data) {
                                txLoad = data.result;
                                console.log(txLoad);

                                txLoad = $.grep(txLoad, function(e) { return e.tokenSymbol!="BOGE" });
                                console.log(txLoad);

                                console.log(txHashOne);
                                txLoadHash = txLoad.find(element => element.hash == txHashOne );
                                console.log(txLoadHash);

                                let txBNBAmountOne = addDecPrecise(txLoadHash.value, 1000000000000000000);
                                console.log(txBNBAmountOne);

                                console.log(txAmountOne);

                                let bnbTotal = txBNBAmountOne * bnbPrice;

                                bogePrice = (bnbTotal/txAmountOne).toFixed(2);

                                console.log(bogePrice);

                                startBlock = 0;
                                latestAddTR = 0;
                                dataLength = 0;
                                blockLoad = [];

                            })
                                .done(function() {
                                    jQuery.getJSON("https://api.pancakeswap.info/api/tokens", function(data) {
                                        let pancakePriceData = data.data["0x248C45AF3b2f73Bc40FA159f2a90ce9caD7A77BA"];
                                        console.log(pancakePriceData);

                                        trueBogePriceUSD = parseFloat(pancakePriceData.price);
                                        console.log(trueBogePriceUSD);

                                        trueBogePriceBNB = parseFloat(pancakePriceData.price_BNB);
                                        console.log(trueBogePriceBNB);

                                        $(".spanPrice .pTem .rawTxtHTML").html("$" + trueBogePriceUSD.toFixed(2) + " USD ");

                                        let marketCap = (currentSupply * trueBogePriceUSD).toFixed(0);
                                        console.log(marketCap);
        
                                        $(".mcapPrice .pTem").html("$" + initialNumFormat(marketCap) + " USD <i class='fa fa-caret-up mcaptxtcaret'></i>");

                                        if (txTypeOne === "Buy") {
                                            $(".mcaptxttop").removeClass("nTem");
                                            $(".mcaptxttop").addClass("pTem");
                                            $(".pricetxttop").removeClass("nTem");
                                            $(".pricetxttop").addClass("pTem");
                                            $(".mcaptxtcaret").removeClass("fa-caret-down");
                                            $(".mcaptxtcaret").addClass("fa-caret-up");
                                            $(".pricetxtcaret").removeClass("fa-caret-down");
                                            $(".pricetxtcaret").addClass("fa-caret-up");
                                        } else if(txTypeOne === "Sell") {
                                            $(".mcaptxttop").removeClass("pTem");
                                            $(".mcaptxttop").addClass("nTem");
                                            $(".pricetxttop").removeClass("pTem");
                                            $(".pricetxttop").addClass("nTem");
                                            $(".mcaptxtcaret").removeClass("fa-caret-up");
                                            $(".mcaptxtcaret").addClass("fa-caret-down");
                                            $(".pricetxtcaret").removeClass("fa-caret-up");
                                            $(".pricetxtcaret").addClass("fa-caret-down");
                                        } else {
                                            $(".mcaptxttop").removeClass("nTem");
                                            $(".mcaptxttop").addClass("pTem");
                                            $(".pricetxttop").removeClass("nTem");
                                            $(".pricetxttop").addClass("pTem");
                                            $(".mcaptxtcaret").removeClass("fa-caret-down");
                                            $(".mcaptxtcaret").addClass("fa-caret-up");
                                            $(".pricetxtcaret").removeClass("fa-caret-down");
                                            $(".pricetxtcaret").addClass("fa-caret-up");
                                        }
                                    });
                                });
                        });

                    loopID = setInterval(() => {
                        getLatestJSON();
                    }, 10000);
                    loadToggle = true;

                }

            }
        } else {
            blockLoad.length = 0;
        }

    });
}



function blockRotate() {
    intervalID = setInterval(getLatestJSON, pageTime);
}

function getMax(arr, val) {
    var max;
    for (var i = 0 ; i < arr.length ; i++) {
        if (max == null || parseInt(arr[i][val]) > parseInt(max[val])) {
            max = arr[i];
        }
    }
    return max;
}

function checkInitBurn() {
    $("#hash-display-1").hide();
    var getInitBurnURL = "https://api.bscscan.com/api?module=account&action=tokentx&contractaddress="+bContract+"&page=1&offset=100&sort=asc&apikey="+apiKeyChosen;
    var hashToFind = "0x32f13569cb3b4762b61e767fb050443ef60b344107c84843a33d522aa7cce5cb";
    $.getJSON(getInitBurnURL, function(data) {
        initBurnData = data.result;
        console.log(initBurnData);
        var initBurnInfo = initBurnData.find(element => element.hash == hashToFind);
        console.log(initBurnInfo);
        initBurn = initBurnInfo.value;
        console.log(initBurn);
        initBurn = addDec(initBurn, 1000000000);
    })

        .done(function() {
            checkInit();
        });
}

function checkInit() {
    console.log("test" + initBurn);
    var getInitURL = "https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress="+bContract+"&apikey="+apiKeyChosen;
    $.getJSON(getInitURL, function(data) {
        initData = data;
        console.log(initData);
        initSupply = initData.result;
        initSupply = Math.trunc(addDec(initSupply, 1000000000));
        beginSupply = initSupply - initBurn;
    })
        
        .done(function() {
            checkBurn();
        });
}


function checkBurn() {
    var burnAd = "0x000000000000000000000000000000000000dead";
    var getBurnURL = "https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress="+bContract+"&address="+burnAd+"&tag=latest&apikey="+apiKeyChosen;
    $.getJSON(getBurnURL, function(data) {
        burnData = data;
        burnAmnt = burnData.result;
        burnAmnt = addDec(burnAmnt, 1000000000);
        console.log(burnAmnt);
    })

        .done(function() {
            currentSupply = initSupply - burnAmnt;
            currentSupply = addDec(currentSupply, 1);
            totalBurn = (burnAmnt/initSupply) * 100;
            totalBurn = totalBurn.toFixed(2)
            console.log(totalBurn);
            totalCurrent = (currentSupply/initSupply) * 100;
            totalCurrent = totalCurrent.toFixed(2)
            totalInitBurn = (initBurn/initSupply) * 100;
            totalInitBurn = totalInitBurn.toFixed(2);
            console.log(totalInitBurn);
            totalNewBurn = 100 - (parseFloat(totalInitBurn) + parseFloat(totalCurrent));
            totalNewBurn = totalNewBurn.toFixed(2);
            totalCurrent = totalCurrent - totalNewBurn;
            totalCurrent = totalCurrent.toFixed(2);
            totalNewBurn = totalNewBurn * 2;
            newBurnAmnt = beginSupply - currentSupply;
            newBurnAmnt = newBurnAmnt.toFixed(2);
            console.log(newBurnAmnt);
            console.log(totalCurrent);
            console.log(totalNewBurn);
            document.documentElement.style.setProperty('--a1', totalInitBurn);
            document.documentElement.style.setProperty('--a2', totalCurrent);
            document.documentElement.style.setProperty('--a3', totalNewBurn);

            function hoverTooltip() {
                $('#tooltip-red').hide();
                $(document).mousemove(function() {
                    if ($(".donut:nth-child(1):hover").length !=0) {
                        $('#tooltip-red').show();
                        document.getElementById('tooltip-red').innerHTML = "Initial Burn <br /> " +initBurn+ "<br />" +Math.trunc(totalInitBurn)+ "%";
                    } else if($(".donut:nth-child(2):hover").length !=0) {
                        $('#tooltip-red').show();
                        document.getElementById('tooltip-red').innerHTML = "Current Supply <br /> " +currentSupply+ "<br />" +totalCurrent+ "%";
                    } else if($(".donut:nth-child(3):hover").length !=0) {
                        $('#tooltip-red').show();
                        document.getElementById('tooltip-red').innerHTML = "New Burn <br /> " +newBurnAmnt+ "<br />" +totalNewBurn+ "%";
                    } else {
                        $('#tooltip-red').hide();
                    }
                });
            }
            hoverTooltip();

        });
}

blockRotate();
checkInitBurn();

function getBlocks() {
    txToFind = document.getElementById('block_name').value;
    console.log(txToFind);
    const getTXURL = "https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash="+txToFind+"&apikey="+apiKeyChosen;

    $.get(getTXURL, function(data) {
        txData = data.result;
        console.log(txData);
        hashLogged = txData.hash;
        blockLogged = parseInt(txData.blockNumber);
        console.log(blockLogged);
        fromLogged = txData.from;
        toLogged = txData.to;
    })
        .done(function() {
            let addressToCheckURL = "https://api.bscscan.com/api?module=account&action=tokentx&address="+toLogged+"&startblock="+blockLogged+"&endblock="+blockLogged+"&sort=asc&apikey="+apiKeyChosen;
            $.getJSON(addressToCheckURL, function(data) {
                addressCheckLoad = data.result;
                console.log(addressCheckLoad);
                
                addressCheckLoad = $.grep(addressCheckLoad, function(e) { return e.hash==hashLogged });
                console.log(addressCheckLoad);
                hashDataFound = addressCheckLoad[0];
                console.log(hashDataFound);
            })

                .done(function() {

                    try {
                        let currentTokenSymbol = JSON.stringify(hashDataFound.tokenSymbol).replace(/\"/g, "");

                        if (currentTokenSymbol === "WBNB") {
                            let amountSentBNB = JSON.stringify(hashDataFound.value).replace(/\"/g, "");
                            amountSentBNB = addDecPrecise(amountSentBNB, 1000000000000000000);
        
                            let bnbTotal = amountSentBNB * bnbPrice;
        
                            amountSentTotal = (bnbTotal/trueBogePriceUSD).toFixed(2);
        
                            console.log(amountSentTotal);

                            setSearchTable();
                        }
                    }

                    catch {
                        console.log("not bnb");

                        let addressToCheckNotBNBURL = "https://api.bscscan.com/api?module=account&action=tokentx&address="+fromLogged+"&startblock="+blockLogged+"&endblock="+blockLogged+"&sort=asc&apikey="+apiKeyChosen;
                    
                        $.getJSON(addressToCheckNotBNBURL, function(data) {
                            addressCheckLoad = data.result;
                            console.log(addressCheckLoad);

                            addressCheckLoad = $.grep(addressCheckLoad, function(e) { return e.contractAddress==bContract });
                            console.log(addressCheckLoad);

                            hashDataFound = addressCheckLoad[0];
                            console.log(hashDataFound);

                            amountSentTotal = addDec(hashDataFound.value, 1000000000);
                            console.log(amountSentTotal);

                            setSearchTable();
                        });
                    }

                });
        });

}

document.getElementById('block_run').onclick = function () {
    getBlocks();
}

loadID = setInterval(() => {
    loadScreen();
}, 100);

function loadScreen() {
    if (!loadToggle) {
        if (!isLoad) {
            $(".recentTable").hide();
            $(".content").append("<div class='loading-screen'><img src='img/bogelogotest1.gif' draggable='false'></div>");

            $(".searchContainer").hide();
            $(".content2").append("<div class='loading-screen'><img src='img/bogelogotest1.gif' draggable='false'></div>");
            isLoad = true;
        }
    } else {
        $(".recentTable").show();
        $(".searchContainer").show();
        $('.loading-screen').remove();
        clearInterval(loadID);
    }
}

function initialNumFormat(num) {
    if(num > 999 && num < 1000000) {
        return (num/1000).toFixed(2) + "K";
    } else if (num > 999999 && num < 1000000000) {
        return (num/1000000).toFixed(2) + "M";
    } else if (num > 999999999 && num < 1000000000000) {
        return (num/1000000000).foFixed(2) + "B";
    } else if (num > 999999999999 && num < 1000000000000000) {
        return (num/1000000000000).foFixed(2) + "T";
    } else if (num < 1000) {
        return num;
    }
}

function setSearchTable() {
    $("#hash-display-1").show();


    $("#hash-display-1 tr:nth-child(1) td a").html(JSON.stringify(hashDataFound.hash).replace(/\"/g, ""));
    $("#hash-display-1 tr:nth-child(1) td a").attr("href", "https://bscscan.com/tx/" + hashDataFound.hash);

    var blockConfirm = hashDataFound.confirmations;

    if (blockConfirm >= 12) {
        $("#hash-display-1 tr:nth-child(2) td").html(JSON.stringify(blockConfirm).replace(/\"/g, "") +" (Confirmed)");
    } else {
        $("#hash-display-1 tr:nth-child(2) td").html(JSON.stringify(blockConfirm).replace(/\"/g, "") +" (Not Confirmed)");
    }

    var timeStampConvert = JSON.stringify(hashDataFound.timeStamp).replace(/\"/g, "");
    timeStampConvert = new Date(timeStampConvert * 1000);
    console.log(timeStampConvert);
    $("#hash-display-1 tr:nth-child(3) td").html(timeStampConvert);

    $("#hash-display-1 tr:nth-child(4) td a").html(JSON.stringify(hashDataFound.from).replace(/\"/g, ""));
    $("#hash-display-1 tr:nth-child(4) td a").attr("href", "https://bscscan.com/address/" + hashDataFound.from);

    $("#hash-display-1 tr:nth-child(5) td a").html(JSON.stringify(hashDataFound.to).replace(/\"/g, ""));
    $("#hash-display-1 tr:nth-child(5) td a").attr("href", "https://bscscan.com/address/" + hashDataFound.to);

    $("#hash-display-1 tr:nth-child(6) td").html(amountSentTotal + " BOGE ($"+(amountSentTotal*trueBogePriceUSD).toFixed(2)+")");
    
    $("#hash-display-1 tr:nth-child(7) td").html(JSON.stringify(hashDataFound.blockNumber).replace(/\"/g, ""));
}