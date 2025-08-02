package com.example.project.dto;

import lombok.Data;


public class AssetDataDTO {
    private String vcType;
    private String vcSerialNo;
    private String uoc;
    private String outletName;
    private String address;
    private String state;
    private String postalCode;
    private String contactPerson;
    private String mobileNumber;
    private String sts;
	public String getVcType() {
		return vcType;
	}
	public void setVcType(String vcType) {
		this.vcType = vcType;
	}
	public String getVcSerialNo() {
		return vcSerialNo;
	}
	public void setVcSerialNo(String vcSerialNo) {
		this.vcSerialNo = vcSerialNo;
	}
	public String getUoc() {
		return uoc;
	}
	public void setUoc(String uoc) {
		this.uoc = uoc;
	}
	public String getOutletName() {
		return outletName;
	}
	public void setOutletName(String outletName) {
		this.outletName = outletName;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
	public String getContactPerson() {
		return contactPerson;
	}
	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
	}
	public String getMobileNumber() {
		return mobileNumber;
	}
	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}
	public String getSts() {
		return sts;
	}
	public void setSts(String sts) {
		this.sts = sts;
	}
	public AssetDataDTO(String vcType, String vcSerialNo, String uoc, String outletName, String address, String state,
			String postalCode, String contactPerson, String mobileNumber, String sts) {
		super();
		this.vcType = vcType;
		this.vcSerialNo = vcSerialNo;
		this.uoc = uoc;
		this.outletName = outletName;
		this.address = address;
		this.state = state;
		this.postalCode = postalCode;
		this.contactPerson = contactPerson;
		this.mobileNumber = mobileNumber;
		this.sts = sts;
	}
	public AssetDataDTO() {
		super();
	}
    
    
}
