$ErrorActionPreference = 'Stop'

$javaHome = 'C:\Program Files\Java\jdk-25.0.4.1'
$mavenHome = Join-Path $env:USERPROFILE 'Downloads\apache-maven-3.10.0-bin\apache-maven-3.10.0'

if (-not (Test-Path "$javaHome\bin\java.exe")) {
  Write-Error "JDK 25 não encontrado em $javaHome. Ajuste o caminho neste arquivo."
  exit 1
}

if (-not (Test-Path "$mavenHome\bin\mvn.cmd")) {
  Write-Error "Maven não encontrado em $mavenHome. Ajuste o caminho neste arquivo."
  exit 1
}

$env:JAVA_HOME = $javaHome
$env:MAVEN_HOME = $mavenHome
$env:Path = "$javaHome\bin;$mavenHome\bin;$env:Path"

Set-Location $PSScriptRoot
& "$mavenHome\bin\mvn.cmd" spring-boot:run
exit $LASTEXITCODE
