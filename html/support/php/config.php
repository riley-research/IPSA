<?php
	$host = 'localhost';
	$db   = 'bulk_spectra';
	$username = 'IPSA_user';
	$password = 'T3mp1@34';
	$charset = 'utf8';
	
	$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
	$opt = [
			PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_BOTH,
			PDO::ATTR_EMULATE_PREPARES   => false
	];
	$pdo = new PDO($dsn, $username, $password, $opt);
	$supportFolder = "/var/www/html/support/";
	$basePath = $supportFolder . "Upload Folder/";
	$downloadPath = $supportFolder . "Download Folder/";
	$relativeZipPath = "support/Download Folder/";
?>