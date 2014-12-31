<?php

/**
 * Get the first 8 characters of the git sha1 hash
 * Useful for quick and dirty cache busting for assets
 */
$version = exec('git describe --all --long');
$hash = substr($version, -8);
return $hash;
