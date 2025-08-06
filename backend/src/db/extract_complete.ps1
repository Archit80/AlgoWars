# Better script to extract complete top 200 LeetCode questions
$questionNumbers = @(1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,160,162,164,165,166,167,168,169,171,172,173,174,179,187,188,189,190,191,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227)

$inputFile = "leetcode.txt"
$outputFile = "leetcode_filtered.txt"

$lines = Get-Content $inputFile
$output = @()
$currentQuestion = ""
$questionNumber = 0
$inQuestion = $false
$questionStarted = $false

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    
    # Check if this line contains a question number
    if ($line -match "^(\d+)\. [A-Z]") {
        # If we were in a question, add it to output if it's in our list
        if ($inQuestion -and $questionStarted -and $questionNumbers -contains $questionNumber) {
            $output += $currentQuestion
            $output += ""
            $output += ""
        }
        
        # Start new question
        $questionNumber = [int]$matches[1]
        $currentQuestion = ""
        $inQuestion = $true
        $questionStarted = $false
    }
    
    # Check if this is the start of a question (asterisks line before question)
    if ($line -match "^\*+$" -and $i + 1 -lt $lines.Length -and $lines[$i + 1] -match "^(\d+)\. [A-Z]") {
        $questionStarted = $true
        $currentQuestion = $line
    } elseif ($inQuestion) {
        $currentQuestion += "`n" + $line
    }
}

# Don't forget the last question
if ($inQuestion -and $questionStarted -and $questionNumbers -contains $questionNumber) {
    $output += $currentQuestion
}

# Write the filtered content to new file
$output -join "`n" | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "Successfully created $outputFile with top 200 LeetCode questions"
