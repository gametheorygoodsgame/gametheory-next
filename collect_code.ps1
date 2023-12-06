# Output file
$outputFile = ".\code_out.txt"

# Remove the output file if it exists (to overwrite it)
if (Test-Path -Path $outputFile) {
    Remove-Item -Path $outputFile
}

# Define the directories to search recursively with absolute paths
$directories = @(
    ".\src\utils"
)

# Iterate over specified directories and their subdirectories for .ts files
foreach ($directory in $directories) {
    $escapedDirectory = $directory -replace '\[', '`[' -replace '\]', '`]'
    Get-ChildItem -Path $escapedDirectory -Recurse -Include *.ts, *.tsx, *.js, *.jsx, *.css | ForEach-Object {
        $escapedPath = $_.FullName -replace '\[', '`[' -replace '\]', '`]'
        Add-Content -Path $outputFile -Value "// $escapedPath"
        Get-Content -Path $escapedPath | Add-Content -Path $outputFile
    }
}

# Display a message to indicate completion
Write-Host "Code has been collected and written to $outputFile"
