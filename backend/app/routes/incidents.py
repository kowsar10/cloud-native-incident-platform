from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime

from app.schemas.incident_schema import IncidentCreate, IncidentUpdate
from app.database.mongodb import incidents_collection
from app.auth.auth_bearer import get_current_user

router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)


def incident_serializer(incident):
    return {
        "id": str(incident["_id"]),
        "title": incident["title"],
        "description": incident["description"],
        "category": incident["category"],
        "location": incident.get("location"),
        "priority": incident.get("priority", "Medium"),
        "status": incident.get("status", "Open"),
        "created_by": incident.get("created_by"),
        "created_at": str(incident.get("created_at"))
    }


# --------------------------------------
# Create Incident
# --------------------------------------
@router.post("/")
def create_incident(
    incident: IncidentCreate,
    current_user: dict = Depends(get_current_user)
):
    new_incident = {
        "title": incident.title,
        "description": incident.description,
        "category": incident.category,
        "location": incident.location,
        "priority": incident.priority,
        "status": "Open",
        "created_by": current_user["user_id"],
        "created_at": datetime.utcnow()
    }

    result = incidents_collection.insert_one(new_incident)

    return {
        "message": "Incident created successfully",
        "incident_id": str(result.inserted_id)
    }


# --------------------------------------
# View Incidents
# Admin -> All incidents
# User -> Only own incidents
# --------------------------------------
@router.get("/")
def get_all_incidents(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] == "admin":
        incidents = incidents_collection.find()

    else:
        incidents = incidents_collection.find(
            {
                "created_by": current_user["user_id"]
            }
        )

    return [incident_serializer(i) for i in incidents]


# --------------------------------------
# View Single Incident
# --------------------------------------
@router.get("/{incident_id}")
def get_incident(
    incident_id: str,
    current_user: dict = Depends(get_current_user)
):

    if not ObjectId.is_valid(incident_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid incident ID"
        )

    incident = incidents_collection.find_one(
        {"_id": ObjectId(incident_id)}
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    if (
        current_user["role"] != "admin"
        and incident["created_by"] != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return incident_serializer(incident)


# --------------------------------------
# Update Incident
# --------------------------------------
@router.put("/{incident_id}")
def update_incident(
    incident_id: str,
    incident: IncidentUpdate,
    current_user: dict = Depends(get_current_user)
):

    if not ObjectId.is_valid(incident_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid incident ID"
        )

    existing = incidents_collection.find_one(
        {"_id": ObjectId(incident_id)}
    )

    if existing is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    if (
        current_user["role"] != "admin"
        and existing["created_by"] != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only edit your own incidents."
        )

    update_data = {
        k: v
        for k, v in incident.dict().items()
        if v is not None
    }

    incidents_collection.update_one(
        {"_id": ObjectId(incident_id)},
        {"$set": update_data}
    )

    return {
        "message": "Incident updated successfully"
    }


# --------------------------------------
# Delete Incident
# --------------------------------------
@router.delete("/{incident_id}")
def delete_incident(
    incident_id: str,
    current_user: dict = Depends(get_current_user)
):

    if not ObjectId.is_valid(incident_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid incident ID"
        )

    existing = incidents_collection.find_one(
        {"_id": ObjectId(incident_id)}
    )

    if existing is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    if (
        current_user["role"] != "admin"
        and existing["created_by"] != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own incidents."
        )

    incidents_collection.delete_one(
        {"_id": ObjectId(incident_id)}
    )

    return {
        "message": "Incident deleted successfully"
    }