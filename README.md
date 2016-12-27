willmorgan.co.uk
================

version: 1.4

My personal / freelancer promotion website.

## AWS Static Hosting Setup

For my benefit, so I don't forget...

### S3 Bucket

  1. Create an S3 bucket
  2. **Bucket Properties -> Enable website hosting**
  3. **Index document:** `index.html`
  4. **Edit Redirection Rules** to provide the `cv` redirect:
  
  ````
  <RoutingRules>
      <RoutingRule>
          <Condition>
              <KeyPrefixEquals>cv</KeyPrefixEquals>
          </Condition>
          <Redirect>
              <Protocol>https</Protocol>
              <HostName>docs.google.com</HostName>
              <ReplaceKeyWith>/document/d/1cXZjQi9ESDVKs3lqAtWbvsepLz-HLDPao3I9PsYGryc/edit?usp=sharing</ReplaceKeyWith>
              <HttpRedirectCode>302</HttpRedirectCode>
          </Redirect>
      </RoutingRule>
  </RoutingRules>
  ````
 
   5. **Permissions -> Edit Bucket Policy** to allow assets to be made public by default:
   
   ````
   {
   	"Version": "2012-10-17",
   	"Id": "Policy1482880671909",
   	"Statement": [
   		{
   			"Sid": "Stmt1482880670019",
   			"Effect": "Allow",
   			"Principal": "*",
   			"Action": "s3:GetObject",
   			"Resource": "arn:aws:s3:::willmorgan.co.uk/*"
   		}
   	]
   }
   ````
   
   6. **Permissions -> Edit CORS Configuration**
   
   ````
   <?xml version="1.0" encoding="UTF-8"?>
   <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
       <CORSRule>
           <AllowedOrigin>*</AllowedOrigin>
           <AllowedMethod>GET</AllowedMethod>
           <MaxAgeSeconds>3000</MaxAgeSeconds>
           <AllowedHeader>Authorization</AllowedHeader>
       </CORSRule>
   </CORSConfiguration>
   ````
   
   7. `npm run build`, then upload the build dir (to be automated!)
   
### SSL Certificates

   1. Create a certificate for `willmorgan.co.uk` and `www.willmorgan.co.uk`
   2. Upload or configure with **Certificate Manager**

### CloudFront

   1. Set `CNAME` fields: `willmorgan.co.uk`, `www.willmorgan.co.uk`
   2. Use **Custom SSL certificate** (use cert uploaded to certificate manager)
   3. **Default root object:** `index.html` (should match S3 Index Document)
   4. **Origins:** *Copy* the S3 bucket URL you're using. Do not choose it from the dropdown, otherwise redirects will not work.
   5. **Behaviours**
      * Enable **Redirect to HTTPS**
      * **Query String Forwarding:** Allow whitelist (`version`)
      * Enable **Compress Objects Automatically**

### Route 53

   1. Add `A` and `AAAA` records for `willmorgan.co.uk` and `www.willmorgan.co.uk` that alias to the CloudFront distribution ID
    
It will take a while to propagate changes so certificate issues might occur when trying to access with SSL.
