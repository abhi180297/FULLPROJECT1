package com.example.project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity

public class AssetData {

    private String vcType;
    private String vcSerialNo;
    private String uoc;
    private String outletName;
    private String address;
    private String state;
    private String postalCode;
    private String contactPerson;

    @Id
    private String mobileNumber;

    private String status;

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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public AssetData(String vcType, String vcSerialNo, String uoc, String outletName, String address, String state,
			String postalCode, String contactPerson, String mobileNumber, String status) {
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
		this.status = status;
	}

	public AssetData() {
		super();
	}
    
    
}
