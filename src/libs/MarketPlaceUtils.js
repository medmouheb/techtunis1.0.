const MarketPlaceUtils = {

    getApprovalDelayMessage (approvalDelay) {

        let approvalDelayMessage = ""
        let hours = approvalDelay / 3600
        let minutes = (approvalDelay / 60) % 60

        if (Math.round(hours) > 0) {
            approvalDelayMessage = Math.round(hours) + "h " + Math.round(minutes) + "min"
        } else if (Math.round(minutes) > 0) {
            approvalDelayMessage = Math.round(minutes) +' ' + ((Math.round(minutes) > 1) ? "minutes" : "minute")
        } else {
            approvalDelayMessage = "immédiatement"
        }

        return approvalDelayMessage
    }
}

export default MarketPlaceUtils;